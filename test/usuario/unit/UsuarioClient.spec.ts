import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { UsuarioClient } from '../../../src/client/UsuarioClient';
import { headersMock } from '../../models/core.response';
import { usuarioModelo, usuarioModeloActualizado } from '../../models/usuario.modelo';
import { CambiarContraseñaDTO } from '../../../src/DTO/AuthUsuarioDTO';

describe('UsuarioClient', () => {
    let usuarioClient: UsuarioClient;
    const mockBaseUrl = 'http://mock-core.com';

    const clientHeadersMock = {
        origin: headersMock.Origin,
        cookie: headersMock.Cookie,
    };

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
        usuarioClient = new UsuarioClient();
        global.fetch = jest.fn() as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('obtenerUsuario', () => {
        it('Debería hacer GET a /api/usuario/:id enviando Origin y Cookie', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, usuarioModelo));

            const result = await usuarioClient.obtenerUsuario(clientHeadersMock, '1');

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/usuario/1`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': clientHeadersMock.origin,
                        'Cookie': clientHeadersMock.cookie,
                    },
                }
            );
            expect(result.status).toEqual(200);
            expect(result.data).toEqual(usuarioModelo);
        });

        it('Debería retornar data null si el JSON no se puede parsear', async () => {
            const badResponse = {
                status: 500,
                headers: { get: jest.fn(() => null), getSetCookie: jest.fn(() => []) },
                json: jest.fn<() => Promise<any>>().mockRejectedValue(new Error('Invalid JSON')),
            } as unknown as Response;
            jest.mocked(global.fetch).mockResolvedValueOnce(badResponse);

            const result = await usuarioClient.obtenerUsuario(clientHeadersMock, '1');

            expect(result.status).toEqual(500);
            expect(result.data).toBeNull();
        });

        it('Debería propagar el error si fetch falla', async () => {
            jest.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));
            await expect(usuarioClient.obtenerUsuario(clientHeadersMock, '1')).rejects.toThrow('Network error');
        });
    });

    describe('actualizarUsuario', () => {
        it('Debería hacer PATCH a /api/usuario/:id con el body del usuario', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, usuarioModeloActualizado));

            const result = await usuarioClient.actualizarUsuario(usuarioModeloActualizado, clientHeadersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/usuario/${usuarioModeloActualizado.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': clientHeadersMock.origin,
                        'Cookie': clientHeadersMock.cookie,
                    },
                    body: JSON.stringify(usuarioModeloActualizado),
                }
            );
            expect(result.status).toEqual(200);
            expect(result.data).toEqual(usuarioModeloActualizado);
        });
    });

    describe('actualizarContraseña', () => {
        const cambioContraseñaPayload: CambiarContraseñaDTO = {
            id: '1',
            currentPassword: 'oldPassword123',
            newPassword: 'newPassword123',
            revokeOtherSessions: true,
        };

        it('Debería hacer POST a /api/auth/change-password', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { success: true }));

            const result = await usuarioClient.actualizarContraseña(cambioContraseñaPayload, clientHeadersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/auth/change-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': clientHeadersMock.origin,
                        'Cookie': clientHeadersMock.cookie,
                    },
                    body: JSON.stringify(cambioContraseñaPayload),
                }
            );
            expect(result.status).toEqual(200);
            expect(result.data).toEqual({ success: true });
        });
    });

    describe('listarUsuarios', () => {
        it('Debería hacer GET a /api/usuarios sin query params cuando no hay filtros', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, [usuarioModelo]));

            const result = await usuarioClient.listarUsuarios(clientHeadersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/usuarios`,
                {
                    method: 'GET',
                    headers: {
                        'Origin': clientHeadersMock.origin,
                        'Cookie': clientHeadersMock.cookie,
                    },
                }
            );
            expect(result.data).toEqual([usuarioModelo]);
        });

        it('Debería serializar filtros escalares y arrays como query params', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, [usuarioModelo]));

            const filtros = { rol: ['admin', 'becario'], departamento: 'Sistemas' };
            await usuarioClient.listarUsuarios(clientHeadersMock, filtros);

            const calledUrl = jest.mocked(global.fetch).mock.calls[0][0] as string;
            expect(calledUrl).toContain(`${mockBaseUrl}/api/usuarios?`);
            expect(calledUrl).toContain('rol=admin');
            expect(calledUrl).toContain('rol=becario');
            expect(calledUrl).toContain('departamento=Sistemas');
        });

        it('Debería omitir filtros con valor undefined o null', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, []));

            const filtros = { departamento: undefined, nombre: null } as unknown as Record<string, string>;
            await usuarioClient.listarUsuarios(clientHeadersMock, filtros);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/usuarios`,
                expect.objectContaining({ method: 'GET' })
            );
        });
    });

    describe('eliminarUsuario', () => {
        it('Debería hacer DELETE a /api/usuario/:id', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { deleted: true }));

            const result = await usuarioClient.eliminarUsuario(clientHeadersMock, '1');

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/usuario/1`,
                {
                    method: 'DELETE',
                    headers: {
                        'Origin': clientHeadersMock.origin,
                        'Cookie': clientHeadersMock.cookie,
                    },
                }
            );
            expect(result.status).toEqual(200);
            expect(result.data).toEqual({ deleted: true });
        });

        it('Debería propagar el error si fetch falla', async () => {
            jest.mocked(global.fetch).mockRejectedValueOnce(new Error('Timeout'));
            await expect(usuarioClient.eliminarUsuario(clientHeadersMock, '1')).rejects.toThrow('Timeout');
        });
    });
});