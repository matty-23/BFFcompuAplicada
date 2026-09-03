import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from '../../../src/app.module';
import { loginUsuarioDtoMock } from '../../models/auth.modelo';

describe('POST /auth/recuperacion ', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication(new FastifyAdapter());

        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });

    beforeEach(() => { nock.cleanAll(); });

    afterEach(() => { 
        expect(nock.isDone()).toBe(true); 
        nock.cleanAll(); 
    });

    afterAll(async () => { 
        nock.restore(); 
        await app.close(); 
    });

    it('debería enviar correo de recuperación y devolver mensaje', async () => {
        const scope = nock('http://localhost:3000')
            .post('/api/auth/forget-password', {email: loginUsuarioDtoMock.email, redirectTo: "http://localhost:3000/reset" })
            .matchHeader('content-type', 'application/json')
            .matchHeader('origin', 'http://localhost:5173')
            .reply(200, { message: "Correo de recuperación enviado" });

        // LLAMADA SUPERTEST FALTANTE
        const response = await request(app.getHttpServer())
            .post('/auth/recuperacion')
            .set('Origin', 'http://localhost:5173')
            .send({ 
                email: loginUsuarioDtoMock.email, 
                redirectTo: "http://localhost:3000/reset" 
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Correo de recuperación enviado" });
        
        scope.done();
    });

    it("deberia fallar al enviar correo de recuperación con email no registrado", async () => {
        const scope = nock('http://localhost:3000')
            .post('/api/auth/forget-password', { 
                email: "usuario_no_registrado@example.com", 
                redirectTo: "http://localhost:3000/reset" 
            })
            .matchHeader('content-type', 'application/json')
            .matchHeader('origin', 'http://localhost:5173')
            .reply(404, { error: "Usuario no encontrado" });
            
        const response = await request(app.getHttpServer())
            .post('/auth/recuperacion')
            .set('Origin', 'http://localhost:5173')
            .send({ 
                email: "usuario_no_registrado@example.com", 
                redirectTo: "http://localhost:3000/reset" 
            });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Usuario no encontrado" });
        
        scope.done();
    });

    it("debería devolver un error si hay un problema en el servidor", async () => {
        const payload = { 
            email: "usuario@example.com", 
            redirectTo: "http://localhost:3000/reset" 
        };

        const scope = nock("http://localhost:3000")
            // Es buena práctica indicarle a nock el body que espera recibir, para evitar un "No match for request"
            .post("/api/auth/forget-password", payload)
            .matchHeader('origin', 'http://localhost:5173')
            .reply(500, { error: "Error interno del servidor" });
            
        const response = await request(app.getHttpServer())
            .post('/auth/recuperacion')
            .set('Origin', 'http://localhost:5173')
            .send(payload);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Error interno del servidor" });
        
        scope.done();
    });
});