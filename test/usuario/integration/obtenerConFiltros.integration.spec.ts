import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';

describe('Integración: GET /api/usuario/filtros', () => {
    let app: INestApplication;
    let cacheManager: Cache;
    const coreBaseUrl = 'http://localhost:3000';

    beforeAll(async () => {
        process.env.coreBaseUrl = coreBaseUrl;
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication(new FastifyAdapter());
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
        cacheManager = app.get<Cache>(CACHE_MANAGER);
    });

    beforeEach(async () => { nock.cleanAll(); await cacheManager.clear(); });
    afterEach(() => { expect(nock.isDone()).toBe(true); nock.cleanAll(); });
    afterAll(async () => { await app.close(); });

    const cookieValida = 'better-auth.session_token=token_usuarios_filtros;';

    describe('Seguridad y RBAC', () => {
        it('[403] Debería rechazar si el usuario no tiene permiso LISTAR_USUARIOS', async () => {
            // Rol 1 (Visitante) no tiene el permiso
            nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'usr-1', rol: 1 } });

            const res = await request(app.getHttpServer())
                .get('/api/usuario/filtros?limit=10')
                .set('Cookie', cookieValida);
            
            expect(res.status).toBe(403);
        });
    });

    describe('Validación de DTOs (Pipes en Query Params)', () => {
        it('[400] Debería rechazar si el parámetro "limit" excede el máximo permitido (100)', async () => {
            nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });

            // El DTO GetUsuariosQueryDTO tiene @Max(100) en el limit
            const res = await request(app.getHttpServer())
                .get('/api/usuario/filtros?limit=150')
                .set('Cookie', cookieValida);
            
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual(expect.arrayContaining([expect.stringContaining('limit must not be greater than 100')]));
        });

        it('[400] Debería rechazar si el parámetro "ordenar" no está en la lista blanca', async () => {
            nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });

            // El DTO GetUsuariosQueryDTO restringe 'ordenar' a: 'nombre' | 'apellido' | 'correo'
            const res = await request(app.getHttpServer())
                .get('/api/usuario/filtros?ordenar=contraseña')
                .set('Cookie', cookieValida);
            
            expect(res.status).toBe(400);
            expect(res.body.message).toEqual(expect.arrayContaining([expect.stringContaining('ordenar must be one of the following values')]));
        });
    });

    describe('Camino Feliz (Proxy Proxy-Pass)', () => {
        it('[200] Debería delegar los query params limpios al microservicio y devolver la data', async () => {
            nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });
            
            // Notar cómo el BFF convierte los parámetros y los envía al endpoint del microservicio
            nock(coreBaseUrl).get('/api/usuarios?limit=10&ordenar=nombre').reply(200, [{ id: 'usr-1', nombre: 'Juan' }]);

            const res = await request(app.getHttpServer())
                .get('/api/usuario/filtros?limit=10&ordenar=nombre')
                .set('Cookie', cookieValida);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });
});