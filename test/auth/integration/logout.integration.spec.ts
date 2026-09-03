import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from '../../../src/app.module';

describe('POST /auth/logout', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication(new FastifyAdapter());

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
            }),
        );

        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });

    beforeEach(() => { nock.cleanAll(); });

    afterEach(() => { expect(nock.isDone()).toBe(true); nock.cleanAll(); });

    afterAll(async () => { nock.restore(); await app.close(); });

    it("debería cerrar sesión y eliminar cookies", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-out")
            .matchHeader('origin', 'http://localhost:5173')
            .reply(200, { message: "Sesión cerrada correctamente" }, {
                "Set-Cookie": [
                    "better-auth.session_token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
                    "better-auth.csrf_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
                ],
            });


        const response = await request(app.getHttpServer())
            .post("/auth/logout")
            .set("Origin", "http://localhost:5173")
            .set("Cookie", "better-auth.session_token=abc123; better-auth.csrf_token=xyz987");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Sesión cerrada correctamente" });
        scope.done(); 
    });
    it("debería devolver un error si no hay token de sesión", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/logout")
            .set("Origin", "http://localhost:5173");

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
                error: "Unauthorized",
                message: "No se encontró un token de sesión",
                statusCode: 401,
        });

        expect(nock.pendingMocks()).toHaveLength(0);
    });
    it("debería devolver un error si el token de sesión es inválido", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-out")
            .matchHeader('origin', 'http://localhost:5173')
            .reply(401, { error: "Token de sesión inválido" });

        const response = await request(app.getHttpServer())
            .post("/auth/logout")
            .set("Origin", "http://localhost:5173")
            .set("Cookie", "better-auth.session_token=token_invalido; better-auth.csrf_token=xyz987");

        expect(response.status).toBe(401);
        
        expect(response.body).toEqual(
            expect.objectContaining({ error: "Token de sesión inválido" })
        );
        
        scope.done(); 
    });

    it("debería devolver un error si hay un problema en el servidor", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-out")
            .matchHeader('origin', 'http://localhost:5173')
            .reply(500, { error: "Error interno del servidor" });

        const response = await request(app.getHttpServer())
            .post("/auth/logout")
            .set("Origin", "http://localhost:5173")
            .set("Cookie", "better-auth.session_token=abc123; better-auth.csrf_token=xyz987");

        expect(response.status).toBe(500); 
        expect(response.body).toEqual({ error: "Error interno del servidor" });

        scope.done();
    });

});
