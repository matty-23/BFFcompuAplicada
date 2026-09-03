import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from '../../../src/app.module';
import { loginUsuarioDtoMock,loginRespuestaBackendMock } from '../../models/auth.modelo';


describe('POST /auth/login (Integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication(new FastifyAdapter());

        app.useGlobalPipes( new ValidationPipe({whitelist: true,transform: true,  }),);

        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });

    beforeEach(() => {nock.cleanAll(); });

    afterEach(() => {expect(nock.isDone()).toBe(true);nock.cleanAll(); });

    afterAll(async () => {nock.restore();await app.close();});

    it('debería iniciar sesión y devolver cookies', async () => {
        const scope = nock('http://localhost:3000')
            .post('/api/auth/sign-in/email', { ...loginUsuarioDtoMock })
            .matchHeader('content-type', 'application/json')
            .matchHeader('origin', 'http://localhost:5173')
            .reply(
                200,
                loginRespuestaBackendMock,
                {
                    'Set-Cookie': [
                        'better-auth.session_token=abc123; Path=/; HttpOnly',
                        'better-auth.csrf_token=xyz987; Path=/',
                    ],
                },
            );

        const response = await request(app.getHttpServer()).post('/auth/login').set('Origin', 'http://localhost:5173').send(loginUsuarioDtoMock);

        expect(response.status).toBe(200);

        expect(response.body).toEqual(
            loginRespuestaBackendMock
        );

        expect(response.headers['set-cookie']).toEqual(
            expect.arrayContaining([
                expect.stringContaining('better-auth.session_token=abc123'),
                expect.stringContaining('better-auth.csrf_token=xyz987'),
            ]),
        );

        expect(scope.isDone()).toBe(true);
    });

    it('debería devolver 401 si Better Auth rechaza las credenciales', async () => {
        nock('http://localhost:3000')
            .post('/api/auth/sign-in/email') 
            .reply(401, {
                code: 'INVALID_CREDENTIALS',
                message: 'Credenciales inválidas',
            });

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginUsuarioDtoMock);

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            code: 'INVALID_CREDENTIALS',
            message: 'Credenciales inválidas',
        });

        expect(response.headers['set-cookie']).toBeUndefined();
    });

    it('debería devolver 400 cuando el DTO es inválido', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'no-es-un-mail',
                password: '',
            });

        expect(response.status).toBe(400);

        // Nunca llega al Core
        expect(nock.pendingMocks()).toHaveLength(0);
    });
    it("debería reenviar la cookie al Core", async () => {
        const scope = nock("http://localhost:3000")
            .post("/api/auth/sign-in/email")
            .matchHeader(
                "cookie",
                "better-auth.session_token=abc123",
            )
            .reply(200, { ok: true });

        await request(app.getHttpServer())
            .post("/auth/login")
            .set("Cookie", "better-auth.session_token=abc123")
            .send(loginUsuarioDtoMock)
            .expect(200);

        expect(scope.isDone()).toBe(true);
    });
});
