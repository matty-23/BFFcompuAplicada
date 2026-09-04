import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { HttpException } from '@nestjs/common';
import { SolicitudClient } from '../../../src/client/SolicitudClient';
import {  solicitudViewModelMock, crearSolicitudDtoMock, modificarSolicitudDtoMock, aceptarSolicitudDtoMock, rechazarSolicitudDtoMock, filtrosSolicitudDtoMock} from '../../models/solicitud.modelo';
import { Request } from 'express'; 

describe('SolicitudClient', () => {
    let solicitudClient: SolicitudClient;
    let mockRequest: Request;

    const createFetchResponse = (status: number, data: any): Response => ({
        status,
        json: jest.fn<() => Promise<any>>().mockResolvedValue(data),
        text: jest.fn<() => Promise<string>>().mockResolvedValue(typeof data === 'string' ? data : JSON.stringify(data)),
        ok: status >= 200 && status < 300
    } as unknown as Response);

    beforeEach(() => {
        mockRequest = {
                    headers: {
                        origin: 'http://localhost:3000',
                        cookie: 'sessionId=mockSessionId',
                    }
                } as unknown as Request;
        solicitudClient = new SolicitudClient(mockRequest);
        global.fetch = jest.fn() as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('crear', () => {
        it('Debería hacer POST a /api/solicitudes y devolver el ViewModel', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(201, solicitudViewModelMock));

            const result = await solicitudClient.crear(crearSolicitudDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes'), 
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(crearSolicitudDtoMock),
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual(solicitudViewModelMock);
        });

        it('Debería lanzar HttpException si el backend rechaza la creación', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'Datos inválidos'));

            await expect(solicitudClient.crear(crearSolicitudDtoMock)).rejects.toThrow(HttpException);
        });
    });

    describe('obtenerPorId', () => {
        it('Debería hacer GET a /api/solicitudes/:id', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, solicitudViewModelMock));

            const result = await solicitudClient.obtenerPorId('sol-1');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes/sol-1'), 
                expect.objectContaining({
                    headers: expect.any(Object) // Fetch omite el 'method' cuando es GET por defecto
                })
            );
            expect(result).toEqual(solicitudViewModelMock);
        });

        it('Debería retornar null si la solicitud no existe (404)', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce({ status: 404, ok: false } as unknown as Response);

            const result = await solicitudClient.obtenerPorId('sol-999');

            expect(result).toBeNull();
        });

        it('Debería lanzar HttpException ante otros errores del backend', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(500, 'Error interno'));

            await expect(solicitudClient.obtenerPorId('sol-1')).rejects.toThrow(HttpException);
        });
    });

    describe('listar', () => {
        it('Debería transformar filtros y página a Query Params y hacer GET', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, [solicitudViewModelMock]));

            const result = await solicitudClient.listar(filtrosSolicitudDtoMock, 2);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes?estado=Pendiente&page=2'),
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual([solicitudViewModelMock]);
        });

        it('Debería lanzar HttpException si el backend rechaza el listado', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(500, 'Error interno'));

            await expect(solicitudClient.listar(filtrosSolicitudDtoMock, 2)).rejects.toThrow(HttpException);
        });
    });

    describe('listarPorUsuario', () => {
        it('Debería hacer GET a /api/solicitudes/mis con parámetro de página', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, [solicitudViewModelMock]));

            const result = await solicitudClient.listarPorUsuario(1);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes/mis?page=1'),
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual([solicitudViewModelMock]);
        });

        it('Debería lanzar HttpException si el backend rechaza el listado', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(500, 'Error interno'));

            await expect(solicitudClient.listarPorUsuario(1)).rejects.toThrow(HttpException);
        });
    });

    describe('modificar', () => {
        it('Debería hacer PUT a /api/solicitudes/:id', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { ok: true }));

            const result = await solicitudClient.modificar('sol-1', modificarSolicitudDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes/sol-1'), 
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(modificarSolicitudDtoMock),
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual({ ok: true });
        });

        it('Debería lanzar HttpException si el backend rechaza la modificación', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'Datos inválidos'));

            await expect(solicitudClient.modificar('sol-1', modificarSolicitudDtoMock)).rejects.toThrow(HttpException);
        });
    });

    describe('cancelar', () => {
        it('Debería hacer DELETE en /api/solicitudes/:id', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { ok: true }));

            const result = await solicitudClient.cancelar('sol-1');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes/sol-1'), 
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual({ ok: true });
        });

        it('Debería lanzar HttpException si el backend rechaza la cancelación', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(404, 'No encontrada'));

            await expect(solicitudClient.cancelar('sol-1')).rejects.toThrow(HttpException);
        });
    });

    describe('aceptar', () => {
        it('Debería hacer PATCH a /api/solicitudes/:id/aceptar', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { ok: true }));

            const result = await solicitudClient.aceptar('sol-1', aceptarSolicitudDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes/sol-1/aceptar'), 
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify(aceptarSolicitudDtoMock),
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual({ ok: true });
        });

        it('Debería lanzar HttpException si el backend rechaza la aceptación', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'No se puede aceptar'));

            await expect(solicitudClient.aceptar('sol-1', aceptarSolicitudDtoMock)).rejects.toThrow(HttpException);
        });
    });

    describe('rechazar', () => {
        it('Debería hacer PATCH a /api/solicitudes/:id/rechazar enviando los motivos', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { ok: true }));

            const result = await solicitudClient.rechazar('sol-1', rechazarSolicitudDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes/sol-1/rechazar'), 
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify(rechazarSolicitudDtoMock),
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual({ ok: true });
        });

        it('Debería enviar un body vacío si no se especifica dto', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, { ok: true }));

            await solicitudClient.rechazar('sol-1');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/solicitudes/sol-1/rechazar'),
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify({}),
                })
            );
        });

        it('Debería lanzar HttpException si el backend rechaza el rechazo de la solicitud', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'No se puede rechazar'));

            await expect(solicitudClient.rechazar('sol-1', rechazarSolicitudDtoMock)).rejects.toThrow(HttpException);
        });
    });
});