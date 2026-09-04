import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';

describe('Integración: DELETE /api/usuario/:id', () => {
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

    it('[200] Debería eliminar el usuario si posee el permiso ELIMINAR_USUARIO (Ej. Admin)', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });
        
        nock(coreBaseUrl)
            .delete('/api/usuario/usr-123')
            .reply(200, { success: true });

        const res = await request(app.getHttpServer())
            .delete('/api/usuario/usr-123')
            .set('Cookie', 'better-auth.session_token=valido;');
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true });
    });
    
    it('[403] Debería rechazar por RBAC si no tiene el permiso (Ej. Becario)', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'becario', rol: 4 } });
        
        const res = await request(app.getHttpServer())
            .delete('/api/usuario/usr-123')
            .set('Cookie', 'better-auth.session_token=valido;');
        
        expect(res.status).toBe(403);
    });
});