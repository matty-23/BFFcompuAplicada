import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';

describe('Integración: POST /api/usuario/cambiar/contra', () => {
    let app: INestApplication;
    let cacheManager: Cache;
    const coreBaseUrl = 'http://localhost:3000';
    const cookieValida = 'better-auth.session_token=token_pass;';

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

    const payloadInvalido = { id: 'usr-123', currentPassword: 'vieja' }; // Falta newPassword
    const payloadValido = { id: 'usr-123', currentPassword: 'vieja', newPassword: 'nueva' };

    it('[400] Debería frenar la petición si el DTO de cambio de contraseña es inválido', async () => {
        
        const res = await request(app.getHttpServer())
            .post('/api/usuario/cambiar/contra')
            .set('Cookie', cookieValida)
            .send(payloadInvalido);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual(expect.arrayContaining([expect.stringContaining('newPassword should not be empty')]));
    });

    it('[400] Debería propagar el error si el Core rechaza por contraseña actual incorrecta', async () => {
        nock(coreBaseUrl).post('/api/auth/change-password', payloadValido).reply(400, { message: 'Contraseña actual incorrecta' });

        const res = await request(app.getHttpServer())
            .post('/api/usuario/cambiar/contra')
            .set('Cookie', cookieValida)
            .send(payloadValido);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Contraseña actual incorrecta');
    });

    it('[200] Debería cambiar la contraseña correctamente y recibir cookies actualizadas', async () => {
        
        nock(coreBaseUrl)
            .post('/api/auth/change-password', payloadValido)
            .reply(200, { success: true }, {
                'Set-Cookie': ['better-auth.session_token=nuevo_token_post_cambio; Path=/; HttpOnly']
            });

        const res = await request(app.getHttpServer())
            .post('/api/usuario/cambiar/contra')
            .set('Cookie', cookieValida)
            .send(payloadValido);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true });
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toContain('nuevo_token_post_cambio');
    });
});