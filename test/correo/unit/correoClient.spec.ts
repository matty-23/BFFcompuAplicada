import 'reflect-metadata';
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

    // Mock super completo de Fetch Response incluyendo .text() y .ok
    const createFetchResponse = (status: number, data: any): Response => ({
        status,
        ok: status >= 200 && status < 300,
        json: jest.fn<() => Promise<any>>().mockResolvedValue(data),
        text: jest.fn<() => Promise<string>>().mockResolvedValue(typeof data === 'string' ? data : JSON.stringify(data)),
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
       it('Debería hacer POST a /notificaciones y devolver true', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { sent: true }));

    const result = await correoClient.enviarNotificacion(correoDtoMock, clientHeadersMock);

    expect(global.fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/notificaciones`, // <-- URL corregida
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
    expect(result).toEqual({ sent: true });
});

        it('Debería lanzar un error si el status no es 200', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'Bad Request'));

    await expect(correoClient.enviarNotificacion(correoDtoMock, clientHeadersMock))
        .rejects.toThrow('Error 400: Bad Request'); // <-- Sin comillas
});
    });

    describe('enviarCorreoCuenta', () => {
        it('Debería hacer POST a /notificaciones/cuenta/confirmacion y devolver true', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { sent: true }));

    const result = await correoClient.enviarCorreoCuenta(correoConfirmacionCuentaDtoMock, clientHeadersMock);

    expect(global.fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/notificaciones/cuenta/confirmacion`, // <-- URL corregida
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
    expect(result).toEqual({ sent: true });
});
    });
});