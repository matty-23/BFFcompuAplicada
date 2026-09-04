import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';
import { correoDtoMock } from '../../models/correo.modelo';

describe('Integración: POST /api/correo/solicitud/confirmacion', () => {
    let app: INestApplication;
    let cacheManager: Cache;
    const coreBaseUrl = 'http://localhost:3000';
    const cookieValida = 'better-auth.session_token=token_correo_solicitud;';

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

    it('[403] Debería rechazar si el usuario no tiene permiso RECIBIR_NOTIFICACIONES', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'usr-1', rol: 1 } });

        const res = await request(app.getHttpServer())
            .post('/api/correo/solicitud/confirmacion')
            .set('Cookie', cookieValida)
            .send(correoDtoMock);

        expect(res.status).toBe(403);
    });

    it('[200] Debería enviar el correo de confirmación de solicitud correctamente (rol Externo)', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'ext-1', rol: 3 } });
        nock(coreBaseUrl).post('/notificaciones/confirmacion', JSON.stringify(correoDtoMock)).reply(200, {});

        const res = await request(app.getHttpServer())
            .post('/api/correo/solicitud/confirmacion')
            .set('Cookie', cookieValida)
            .send(correoDtoMock);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: true, mensaje: 'Correo de confirmación enviado correctamente.' });
    });

    it('[500] Debería propagar el error si el backend de notificaciones falla', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });
        nock(coreBaseUrl).post('/notificaciones/confirmacion', JSON.stringify(correoDtoMock)).reply(500, 'Error interno');

        const res = await request(app.getHttpServer())
            .post('/api/correo/solicitud/confirmacion')
            .set('Cookie', cookieValida)
            .send(correoDtoMock);

        expect(res.status).toBe(500);
    });
});