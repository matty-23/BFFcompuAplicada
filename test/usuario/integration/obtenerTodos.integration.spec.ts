import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';

describe('Integración: GET /api/usuario/todos', () => {
    let app: INestApplication;
    let cacheManager: Cache;
    const coreBaseUrl = 'http://localhost:3000';

    beforeAll(async () => {
        process.env.coreBaseUrl = coreBaseUrl;
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication(new FastifyAdapter());
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
        cacheManager = app.get<Cache>(CACHE_MANAGER);
    });

    beforeEach(async () => { nock.cleanAll(); await cacheManager.clear(); });
    afterEach(() => { expect(nock.isDone()).toBe(true); nock.cleanAll(); });
    afterAll(async () => { await app.close(); });

    const cookieValida = 'better-auth.session_token=token;';

    it('[403] Debería rechazar si el usuario no tiene permiso LISTAR_USUARIOS', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: '1', rol: 1 } }); // Visitante
        const res = await request(app.getHttpServer()).get('/api/usuario/todos').set('Cookie', cookieValida);
        expect(res.status).toBe(403);
    });

    it('[200] Debería devolver el listado de usuarios (Pass-through) para el Administrador', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } }); // Admin
        nock(coreBaseUrl).get('/api/usuarios').reply(200, [{ id: 'usr-1', nombre: 'Juan' }]);

        const res = await request(app.getHttpServer()).get('/api/usuario/todos').set('Cookie', cookieValida);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 'usr-1', nombre: 'Juan' }]);
    });
});