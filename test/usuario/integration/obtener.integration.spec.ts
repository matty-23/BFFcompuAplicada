import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';

describe('Integración: GET /api/solicitudes/:id', () => {
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

    it('[404] Debería retornar NotFoundException si la solicitud no existe en el Core', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });
        // El cliente retorna null cuando el core da 404, y el controller lanza NotFoundException
        nock(coreBaseUrl).get('/api/solicitudes/999').reply(404, { message: 'No encontrado' });

        const res = await request(app.getHttpServer())
            .get('/api/solicitudes/999')
            .set('Cookie', 'better-auth.session_token=valido;');
        
        expect(res.status).toBe(404);
        expect(res.body.message).toContain('no encontrada');
    });

    it('[200] Debería retornar la solicitud mapeada exitosamente', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });
        nock(coreBaseUrl).get('/api/solicitudes/123').reply(200, { id: '123', estado: 'Pendiente', bloques: [] });

        const res = await request(app.getHttpServer())
            .get('/api/solicitudes/123')
            .set('Cookie', 'better-auth.session_token=valido;');
        
        expect(res.status).toBe(200);
        expect(res.body.id).toBe('123');
    });
    it('[403] Debería rechazar si no tiene permiso (Actualmente requiere MODIFICAR_USUARIO_PROPIO)', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: '1', rol: 1 } }); // Visitante
        const res = await request(app.getHttpServer()).get('/api/usuario/123').set('Cookie', 'better-auth.session_token=valido;');
        expect(res.status).toBe(403);
    });

    it('[200] Debería devolver un usuario específico', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });
        nock(coreBaseUrl).get('/api/usuario/123').reply(200, { id: '123', nombre: 'Carlos' });

        const res = await request(app.getHttpServer()).get('/api/usuario/123').set('Cookie', 'better-auth.session_token=valido;');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe('123');
    });
});