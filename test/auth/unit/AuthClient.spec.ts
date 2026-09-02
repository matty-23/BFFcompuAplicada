import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { AuthClient } from '../../../src/client/AuthClient';
import { headersMock } from '../../models/core.response';
import { registrarUsuarioDtoMock, loginUsuarioDtoMock, correoRecuperacionDtoMock, restablecerContrasenaDtoMock } from '../../models/auth.modelo';

describe('AuthClient', () => {
    let authClient: AuthClient;
    const mockBaseUrl = 'http://mock-core.com';

    // Helper para emular la respuesta nativa de fetch() y sus headers
    const createFetchResponse = (status: number, data: any, cookies: string[] = []): Response => {
        const headers = {
            get: jest.fn((name: string) => {
                if (name.toLowerCase() === 'set-cookie') {
                    return cookies.length > 0 ? cookies[0] : null; // Simula comportamiento de un solo string
                }
                return null;
            }),
            getSetCookie: jest.fn(() => cookies), // Simula la API moderna de fetch para cookies
        };

        return {
            status,
            headers,
            json: jest.fn().mockResolvedValue(data),
        } as unknown as Response;
    };

    beforeEach(() => {
        // Configuramos la variable de entorno que usa el cliente
        process.env.coreBaseUrl = mockBaseUrl;
        authClient = new AuthClient();
        
        // Limpiamos el mock de fetch antes de cada test[cite: 3]
        global.fetch = jest.fn(); 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registrarUsuario', () => {
        it('Debería hacer POST a /api/auth/sign-up/email enviando Origin y Cookie', async () => {
            const mockResponse = createFetchResponse(201, { id: '1' });
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

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
            expect(result.status).toEqual(201);
            expect(result.data).toEqual({ id: '1' });
        });
    });

    describe('iniciarSesion', () => {
        it('Debería hacer POST a /api/auth/sign-in/email y extraer correctamente las cookies', async () => {
            const mockCookies = ['sessionId=123; HttpOnly; Path=/'];
            const mockResponse = createFetchResponse(200, { token: 'abc' }, mockCookies);
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

            const result = await authClient.iniciarSesion(loginUsuarioDtoMock, headersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/sign-in/email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': 'http://localhost:3001', // NOTA: Esto está hardcodeado en tu implementación actual
                    },
                    body: JSON.stringify(loginUsuarioDtoMock),
                }
            );
            expect(result.status).toEqual(200);
            expect(result.data).toEqual({ token: 'abc' });
            expect(result.cookies).toEqual(mockCookies); // Verifica la extracción de la cookie[cite: 3]
        });
    });

    describe('validarSesion', () => {
        it('Debería hacer GET a /api/auth/get-session', async () => {
            const mockResponse = createFetchResponse(200, { valid: true });
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

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
            expect(result.data).toEqual({ valid: true });
        });
    });

    describe('cerrarSesion', () => {
        it('Debería hacer POST a /api/auth/sign-out', async () => {
            const mockResponse = createFetchResponse(200, { success: true });
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

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
            const mockResponse = createFetchResponse(200, { sent: true });
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

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
            const mockResponse = createFetchResponse(200, { updated: true });
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

            const result = await authClient.restablecerContrasena(restablecerContrasenaDtoMock, headersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': headersMock.Origin,
                    },
                    // Verifica que el body se arma explícitamente con newPassword y token
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