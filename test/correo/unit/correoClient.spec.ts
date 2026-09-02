import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { CorreoClient } from '../../../src/client/CorreoClient';
import { headersMock } from '../../models/core.response';
import { correoDtoMock, correoConfirmacionCuentaDtoMock } from '../../models/correo.modelo';

describe('CorreoClient', () => {
    let correoClient: CorreoClient;
    const mockBaseUrl = 'http://mock-core.com';

    const clientHeadersMock = {
        origin: headersMock.Origin,
        cookie: headersMock.Cookie,
    };

    const createFetchResponse = (status: number, data: any): Response => ({
        status,
        json: jest.fn<() => Promise<any>>().mockResolvedValue(data),
    } as unknown as Response);

    beforeEach(() => {
        process.env.coreBaseUrl = mockBaseUrl;
        correoClient = new CorreoClient();
        global.fetch = jest.fn() as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('enviarNotificacion', () => {
        it('Debería hacer POST a /api/correo/notificacion y devolver true', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { sent: true }));

            const result = await correoClient.enviarNotificacion(correoDtoMock, clientHeadersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/correo/notificacion`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': clientHeadersMock.origin,
                        'Cookie': clientHeadersMock.cookie,
                    },
                    body: JSON.stringify(correoDtoMock),
                }
            );
            expect(result).toBe(true);
        });

        it('Debería devolver false si el status no es 200', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, { error: 'Bad Request' }));

            const result = await correoClient.enviarNotificacion(correoDtoMock, clientHeadersMock);
            expect(result).toBe(false);
        });
    });

    describe('enviarCorreoCuenta', () => {
        it('Debería hacer POST a /api/correo/cuenta y devolver true', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { sent: true }));

            const result = await correoClient.enviarCorreoCuenta(correoConfirmacionCuentaDtoMock, clientHeadersMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/correo/cuenta`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': clientHeadersMock.origin,
                        'Cookie': clientHeadersMock.cookie,
                    },
                    body: JSON.stringify(correoConfirmacionCuentaDtoMock),
                }
            );
            expect(result).toBe(true);
        });
    });
});