import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { SolicitudClient } from '../../../src/client/SolicitudClient';
import {  solicitudViewModelMock, crearSolicitudDtoMock, modificarSolicitudDtoMock, aceptarSolicitudDtoMock, rechazarSolicitudDtoMock, filtrosSolicitudDtoMock} from '../../models/solicitud.modelo';
import { Request } from 'express'; 

describe('SolicitudClient', () => {
    let solicitudClient: SolicitudClient;
    let mockRequest: Request;

    const createFetchResponse = (status: number, data: any): Response => ({
        status,
        json: jest.fn<() => Promise<any>>().mockResolvedValue(data),
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
    });
});