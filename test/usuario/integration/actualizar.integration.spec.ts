import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';

describe('Integración: PATCH /api/usuario (Actualizar)', () => {
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

    const cookieValida = 'better-auth.session_token=token_usuario_patch;';

    describe('Especificación PATCH /api/usuario', () => {
        it('[403] Debería rechazar si no tiene permisos de modificación', async () => {
            nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'usr-1', rol: 1 } });

            // Enviamos un payload que cumpla con el DTO para que el Pipe no lo frene antes que el Guard
            const payload = { id: 'usr-1', nombre: 'A', apellido: 'B', correo: 'a@a.com', rol: 'admin', departamento: 'Sistemas' };

            const res = await request(app.getHttpServer()).patch('/api/usuario').set('Cookie', cookieValida).send(payload);
            
            expect(res.status).toBe(403);
        });

        it('[200] Debería hacer passthrough del status del microservicio (Ej. si el microservicio devuelve 400 por correo duplicado)', async () => {
            // Un usuario con rol 4 (Becario) tiene MODIFICAR_USUARIO_PROPIO
            nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'usr-1', rol: 4 } });
            
            const payload = { id: 'usr-1', nombre: 'Juan', apellido: 'Perez', correo: 'duplicado@test.com', rol: 'becario', departamento: 'IT' };

            // Simulamos que el microservicio dice "400 Bad Request"
            nock(coreBaseUrl).patch('/api/usuario/usr-1').reply(400, { message: 'Correo ya está en uso' });

            const res = await request(app.getHttpServer())
                .patch('/api/usuario')
                .set('Cookie', cookieValida)
                .send(payload);
            
            // El controlador extrae el status del CoreResponse y lo asienta en el res de Fastify
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Correo ya está en uso');
        });
    });
});