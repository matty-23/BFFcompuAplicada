import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppModule } from '../../../src/app.module';
describe('Integración: DELETE /api/eventos/:id', () => {
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
        
    it('[204] Debería transformar el ID único de la URL en un array para el Core y retornar NO_CONTENT', async () => {
        nock(coreBaseUrl).get('/api/auth/get-session').reply(200, { user: { id: 'admin', rol: 2 } });
        
        // El EventoService recibe string pero envía [id] al client, y el client hace DELETE a /api/Eventos con un array en el Body[cite: 2]
        nock(coreBaseUrl)
            .delete('/api/Eventos', JSON.stringify(["ev-1"])) 
            .reply(200, {});

        const res = await request(app.getHttpServer())
            .delete('/api/eventos/ev-1')
            .set('Cookie', 'better-auth.session_token=valido;');
        
        expect(res.status).toBe(204);
    });
});