import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from '../../../src/app.module';
import { loginUsuarioDtoMock, loginRespuestaBackendMock, registroRespuestaBackendMock, registrarUsuarioDtoMock } from '../../models/auth.modelo';

describe('POST /auth/registro', () => {
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

    it("debería registrar un usuario y devolver cookies", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-up/email", { ...registrarUsuarioDtoMock })
            .matchHeader("content-type", "application/json")
            .matchHeader('origin', 'http://localhost:5173')
            .reply(200, registroRespuestaBackendMock, {
                "Set-Cookie": [
                    "better-auth.session_token=abc123; Path=/; HttpOnly",
                    "better-auth.csrf_token=xyz987; Path=/",
                ],
            });

        const response = await request(app.getHttpServer())
            .post("/auth/registro")
            .set('Origin', 'http://localhost:5173')
            .send(registrarUsuarioDtoMock);

        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            auth: registroRespuestaBackendMock,
            usuario: registroRespuestaBackendMock.user,
        });

        expect(response.headers["set-cookie"]).toEqual(
            expect.arrayContaining([
                expect.stringContaining("better-auth.session_token=abc123"),
                expect.stringContaining("better-auth.csrf_token=xyz987"),
            ]),
        );

        expect(scope.isDone()).toBe(true);
    });
    it("debería devolver un error si el correo ya está registrado", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-up/email", { ...registrarUsuarioDtoMock })
            .matchHeader("content-type", "application/json")
            .matchHeader('origin', 'http://localhost:5173')
            .reply(400, {
                error: "Bad Request",
                message: "El correo ya está registrado.",
                statusCode: 400,
            });


        const response = await request(app.getHttpServer())
            .post("/auth/registro")
            .set('Origin', 'http://localhost:5173')
            .send(registrarUsuarioDtoMock);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            error: "Bad Request",
            message: "El correo ya está registrado.",
            statusCode: 400,
        });
        expect(scope.isDone()).toBe(true);
    });
    it("deberia devolver un error 500 si hay error interno en el servidor", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-up/email", { ...registrarUsuarioDtoMock })
            .matchHeader("content-type", "application/json")
            .matchHeader('origin', 'http://localhost:5173')
            .reply(500, {
                error: "Internal Server Error",
                message: "Error interno del servidor",
                statusCode: 500,
            });

        const response = await request(app.getHttpServer())
            .post("/auth/registro")
            .set('Origin', 'http://localhost:5173')
            .send(registrarUsuarioDtoMock);

        expect(response.status).toBe(500);

        expect(response.body).toEqual({
            error: "Internal Server Error",
            message: "Error interno del servidor",
            statusCode: 500,
        });
        expect(scope.isDone()).toBe(true);

    });
    it("deberia devolver el error si ocurre otro error", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-up/email", { ...registrarUsuarioDtoMock })
            .matchHeader("content-type", "application/json")
            .matchHeader('origin', 'http://localhost:5173')
            .reply(418, {
                error: "I'm a teapot",
                message: "No se puede preparar café con una tetera",
                statusCode: 418,
            });


        const response = await request(app.getHttpServer())
            .post("/auth/registro")
            .set('Origin', 'http://localhost:5173')
            .send(registrarUsuarioDtoMock);

        expect(response.status).toBe(418);

        expect(response.body).toEqual({
            error: "I'm a teapot",
            message: "No se puede preparar café con una tetera",
            statusCode: 418,
        });
        expect(scope.isDone()).toBe(true);
    });

});