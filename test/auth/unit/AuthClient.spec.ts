import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { AuthClient } from '../../../src/client/AuthClient';
import { headersMock } from '../../models/core.response';
import {  registrarUsuarioDtoMock,  loginUsuarioDtoMock, correoRecuperacionDtoMock,  restablecerContrasenaDtoMock } from '../../models/auth.modelo';

describe('AuthClient', () => {
    let authClient: AuthClient;
    const mockBaseUrl = 'http://mock-core.com';

    // Helper limpio y directo
    const createFetchResponse = (status: number, data: any, cookies: string[] = []): Response => ({
        status,
        headers: {
            get: jest.fn((name: string) => 
                name.toLowerCase() === 'set-cookie' ? cookies[0] ?? null : null
            ),
            getSetCookie: jest.fn(() => cookies),
        },
        json: jest.fn<() => Promise<any>>().mockResolvedValue(data),
    } as unknown as Response);

    beforeEach(() => {
        process.env.coreBaseUrl = mockBaseUrl;
        authClient = new AuthClient();
        global.fetch = jest.fn() as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registrarUsuario', () => {
        it('Debería hacer POST a /api/auth/sign-up/email enviando Origin y Cookie', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(201, { id: '1' }));

            const result = await authClient.registrarUsuario(registrarUsuarioDtoMock, headersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/sign-up/email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': headersMock.Origin,
                        'Cookie': headersMock.Cookie,
                    },
                    body: JSON.stringify(registrarUsuarioDtoMock),
                }
            );
            expect(result.status).toEqual(200);
            expect(result.data).toEqual({ id: '1' });
        });

        it('Debería propagar el error si fetch falla', async () => {
            jest.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));
            await expect(authClient.registrarUsuario(registrarUsuarioDtoMock, headersMock)).rejects.toThrow('Network error');
        });
    });

    describe('iniciarSesion', () => {
        it('Debería hacer POST a /api/auth/sign-in/email y extraer correctamente las cookies', async () => {
            const mockCookies = ['sessionId=123; HttpOnly; Path=/'];
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { token: 'abc' }, mockCookies));

            const result = await authClient.iniciarSesion(loginUsuarioDtoMock, headersMock);

            // IMPORTANTE: Asegurate de arreglar tu código de producción para que use headersMock.Origin 
            // en lugar de 'http://localhost:3001' hardcodeado.
            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/sign-in/email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': headersMock.Origin, 
                    },
                    body: JSON.stringify(loginUsuarioDtoMock),
                }
            );
            expect(result.status).toEqual(200);
            expect(result.data).toEqual({ token: 'abc' });
            expect(result.cookies).toEqual(mockCookies);
        });

        it('Debería propagar el error de conexión de fetch', async () => {
            jest.mocked(global.fetch).mockRejectedValueOnce(new Error('Core no disponible'));
            await expect(authClient.iniciarSesion(loginUsuarioDtoMock, headersMock)).rejects.toThrow('Core no disponible');
        });
    });

    describe('validarSesion', () => {
        it('Debería hacer GET a /api/auth/get-session', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { valid: true }));

            const result = await authClient.validarSesion(headersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/get-session`,
                {
                    method: 'GET',
                    headers: {
                        'Origin': headersMock.Origin,
                        'Cookie': headersMock.Cookie,
                    },
                }
            );
            expect(result.status).toEqual(200);
        });
    });

    describe('cerrarSesion', () => {
        it('Debería hacer POST a /api/auth/sign-out', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { success: true }));

            const result = await authClient.cerrarSesion(headersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/sign-out`,
                {
                    method: 'POST',
                    headers: {
                        'Origin': headersMock.Origin,
                        'Cookie': headersMock.Cookie,
                    },
                }
            );
            expect(result.status).toEqual(200);
        });
    });

    describe('solicitarRecuperacion', () => {
        it('Debería hacer POST a /api/auth/forget-password', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { sent: true }));

            const result = await authClient.solicitarRecuperacion(correoRecuperacionDtoMock, headersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/forget-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': headersMock.Origin,
                    },
                    body: JSON.stringify(correoRecuperacionDtoMock),
                }
            );
            expect(result.status).toEqual(200);
        });
    });

    describe('restablecerContrasena', () => {
        it('Debería hacer POST a /api/auth/reset-password mapeando los campos del DTO', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { updated: true }));

            const result = await authClient.restablecerContrasena(restablecerContrasenaDtoMock, headersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': headersMock.Origin,
                    },
                    body: JSON.stringify({
                        newPassword: restablecerContrasenaDtoMock.newPassword,
                        token: restablecerContrasenaDtoMock.token
                    }),
                }
            );
            expect(result.status).toEqual(200);
        });
    });
});