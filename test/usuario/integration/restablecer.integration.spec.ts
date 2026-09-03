import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from '../../../src/app.module';

describe('POST /auth/restablecer', () => {
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

    afterEach(() => { expect(nock.isDone()).toBe(true); nock.cleanAll(); });

    afterAll(async () => {  nock.restore();   await app.close();   });

    it('debería restablecer la contraseña exitosamente y devolver cookies', async () => {
        const payload = { 
            newPassword: "MiNuevaPassword123!", 
            token: "token_de_recuperacion_valido" 
        };

        // NOTA: Ajusta la ruta '/api/auth/reset-password' si tu servicio usa una diferente
        const scope = nock('http://localhost:3000')
            .post('/api/auth/reset-password')
            .reply(200, { message: "Contraseña actualizada correctamente" }, {
                'Set-Cookie': [
                    'better-auth.session_token=nuevo_token123; Path=/; HttpOnly',
                    'better-auth.csrf_token=nuevo_csrf987; Path=/'
                ]
            });

        const response = await request(app.getHttpServer())
            .post('/auth/restablecer')
            .set('Origin', 'http://localhost:5173')
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Contraseña actualizada correctamente" });
        
        expect(response.headers['set-cookie']).toBeDefined();
        expect(response.headers['set-cookie'][0]).toContain('better-auth.session_token');
        
        scope.done();
    });

    it('debería fallar por validación del DTO si faltan campos', async () => {
        
        const payloadInvalido = { 
            token: "token_de_recuperacion_valido" 
            // Falta newPassword
        };

        const response = await request(app.getHttpServer())
            .post('/auth/restablecer')
            .set('Origin', 'http://localhost:5173')
            .send(payloadInvalido);

        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Bad Request",
                message: expect.arrayContaining(["newPassword should not be empty", "newPassword must be a string"])
            })
        );
    });

    it('debería devolver error si el token proporcionado es inválido o expiró', async () => {
        const payload = { 
            newPassword: "MiNuevaPassword123!", 
            token: "token_invalido" 
        };

        const scope = nock('http://localhost:3000')
            .post('/api/auth/reset-password')
            .reply(400, { error: "El token de recuperación es inválido o ha expirado" });

        const response = await request(app.getHttpServer())
            .post('/auth/restablecer')
            .set('Origin', 'http://localhost:5173')
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "El token de recuperación es inválido o ha expirado" });
        
        scope.done();
    });

    it("debería devolver un error 500 si hay un problema en el servidor principal", async () => {
        const payload = { 
            newPassword: "MiNuevaPassword123!", 
            token: "token_valido" 
        };

        const scope = nock("http://localhost:3000")
            .post("/api/auth/reset-password")
            .reply(500, { error: "Error interno del servidor" });
            
        const response = await request(app.getHttpServer())
            .post('/auth/restablecer')
            .set('Origin', 'http://localhost:5173')
            .send(payload);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ 
            error: "Error interno del servidor" 
        });
        
        scope.done();
    });
});