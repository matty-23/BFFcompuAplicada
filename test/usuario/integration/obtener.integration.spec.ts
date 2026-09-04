import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';

describe('Integración: GET /api/usuario/:id', () => {
    let app: INestApplication;
    let cacheManager: Cache;
    const coreBaseUrl = 'http://localhost:3000';
    const cookieValida = 'better-auth.session_token=token_valido;';

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

    it('[403] Debería rechazar si el usuario no tiene permiso MODIFICAR_USUARIO_PROPIO (Ej. Visitante)', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'usr-1', rol: 1 } });
        
        const res = await request(app.getHttpServer())
            .get('/api/usuario/usr-123')
            .set('Cookie', cookieValida);
        
        expect(res.status).toBe(403);
    });

    it('[404] Debería propagar el error si el microservicio indica que el usuario no existe', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'usr-admin', rol: 2 } });
        nock(coreBaseUrl).get('/api/usuario/usr-999').reply(404, { message: 'Usuario no encontrado' });
        
        const res = await request(app.getHttpServer())
            .get('/api/usuario/usr-999')
            .set('Cookie', cookieValida);
        
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Usuario no encontrado');
    });

    it('[200] Debería obtener un usuario específico exitosamente', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'usr-admin', rol: 2 } });
        nock(coreBaseUrl).get('/api/usuario/usr-123').reply(200, { id: 'usr-123', nombre: 'Carlos', correo: 'carlos@test.com' });
        
        const res = await request(app.getHttpServer())
            .get('/api/usuario/usr-123')
            .set('Cookie', cookieValida);
        
        expect(res.status).toBe(200);
        expect(res.body.id).toBe('usr-123');
        expect(res.body.correo).toBe('carlos@test.com');
    });
});