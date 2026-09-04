import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { HttpException } from '@nestjs/common';
import { EventoClient } from '../../../src/client/EventoClient';
import { eventoViewModelMock, crearEventoMultiDtoMock, actualizarEventoDtoMock, actualizarOcurrenciaDtoMock, filtrosEventoDtoMock } from '../../models/evento.modelo';
import { Request } from 'express'; // Importamos el tipo Request de express

describe('EventoClient', () => {
    let eventoClient: EventoClient;
    const mockBaseUrl = 'http://mock-core.com';
    let mockRequest: Request; // Definimos la variable para la request inyectada

    const createFetchResponse = (status: number, data: any): Response => ({
    status,
    ok: status >= 200 && status < 300, 
    json: jest.fn<() => Promise<any>>().mockResolvedValue(data),
    text: jest.fn<() => Promise<string>>().mockResolvedValue(typeof data === 'string' ? data : JSON.stringify(data)),
} as unknown as Response);

    beforeEach(() => {
        process.env.coreBaseUrl = mockBaseUrl;

        // 1. Mockeamos la request que NestJS inyectaría automáticamente
        mockRequest = {
            headers: {
                origin: 'http://localhost:3000',
                cookie: 'sessionId=mockSessionId',
            }
        } as unknown as Request;

        // 2. Pasamos el mockRequest al constructor
        eventoClient = new EventoClient(mockRequest);
        global.fetch = jest.fn() as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('Debería hacer GET a /api/eventos y retornar el array de ViewModel', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, [eventoViewModelMock]));

            const result = await eventoClient.getAll();

            expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/api/Eventos/1/all`, expect.objectContaining({
                headers: expect.any(Object)
            })
            );
            expect(result).toEqual([eventoViewModelMock]);
        });

        it('Debería lanzar HttpException si la respuesta no es ok', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(500, 'Error interno'));

            await expect(eventoClient.getAll()).rejects.toThrow(HttpException);
        });
    });

    describe('getById', () => {
        it('Debería hacer GET a /api/eventos/:id y retornar el ViewModel', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, eventoViewModelMock));

            const result = await eventoClient.getById('1');

            expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/api/Eventos/1`, expect.objectContaining({
                headers: expect.any(Object)
            }));
            expect(result).toEqual(eventoViewModelMock);
        });

        it('Debería retornar null si el evento no existe (404)', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce({ status: 404, ok: false } as unknown as Response);

            const result = await eventoClient.getById('inexistente');

            expect(result).toBeNull();
        });

        it('Debería lanzar HttpException ante otros errores del backend', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(500, 'Error interno'));

            await expect(eventoClient.getById('1')).rejects.toThrow(HttpException);
        });
    });

    describe('crearMulti', () => {
        it('Debería hacer POST a /api/eventos/multi y devolver el EventoViewModel', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(201, eventoViewModelMock));

            const result = await eventoClient.crearMulti(crearEventoMultiDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/Eventos/multi`,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.any(Object),
                    body: JSON.stringify(crearEventoMultiDtoMock)
                })
            );
            expect(result).toEqual(eventoViewModelMock);
        });

        it('Debería lanzar HttpException si el backend rechaza la creación', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'Datos inválidos'));

            await expect(eventoClient.crearMulti(crearEventoMultiDtoMock)).rejects.toThrow(HttpException);
        });
    });

    describe('crearMono', () => {
        it('Debería hacer POST a /api/eventos/mono y devolver el EventoViewModel', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(201, eventoViewModelMock));

            const result = await eventoClient.crearMono(crearEventoMultiDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/Eventos/mono`,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.any(Object),
                    body: JSON.stringify(crearEventoMultiDtoMock)
                })
            );
            expect(result).toEqual(eventoViewModelMock);
        });
    });

    describe('actualizar', () => {
        it('Debería hacer PUT a /api/eventos/:id (void)', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, {}));

            await expect(eventoClient.actualizar('1', actualizarEventoDtoMock)).resolves.not.toThrow();

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/Eventos/1`,
                expect.objectContaining({
                    method: 'PUT',
                    headers: expect.any(Object),
                    body: JSON.stringify(actualizarEventoDtoMock)
                })
            );
        });

        it('Debería lanzar HttpException si la respuesta no es ok', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'Error de validación'));

            await expect(eventoClient.actualizar('1', actualizarEventoDtoMock)).rejects.toThrow(HttpException);
        });
    });

    describe('eliminar', () => {
        it('Debería hacer DELETE a /api/eventos enviando un body con los ids (void)', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, {}));

            await expect(eventoClient.eliminar(['1', '2'])).resolves.not.toThrow();

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/Eventos`,
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.any(Object),
                    body: JSON.stringify(['1', '2'])
                })
            );
        });

        it('Debería lanzar HttpException si el backend rechaza la eliminación', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(500, 'Error interno'));

            await expect(eventoClient.eliminar(['1'])).rejects.toThrow(HttpException);
        });
    });

    describe('actualizarOcurrencia', () => {
        it('Debería hacer PATCH a /api/eventos/:idEvento/ocurrencias/:idOcurrencia', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, eventoViewModelMock));

            const result = await eventoClient.actualizarOcurrencia('1', 'oc-1', actualizarOcurrenciaDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/Eventos/1/ocurrencias/oc-1`,
                expect.objectContaining({
                    method: 'PATCH',
                    headers: expect.any(Object),
                    body: JSON.stringify(actualizarOcurrenciaDtoMock)
                })
            );
            expect(result).toEqual(eventoViewModelMock);
        });

        it('Debería lanzar HttpException si la ocurrencia no existe', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(404, 'No encontrada'));

            await expect(eventoClient.actualizarOcurrencia('1', 'oc-x', actualizarOcurrenciaDtoMock)).rejects.toThrow(HttpException);
        });
    });

    describe('agregarParticipantes', () => {
        it('Debería hacer PATCH a /ocurrencias/:id/AParticipantes con el array de ids', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, {}));

            await expect(eventoClient.agregarParticipantes('oc-1', ['u1', 'u2'])).resolves.not.toThrow();

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/Eventos/ocurrencias/oc-1/AParticipantes`,
                expect.objectContaining({
                    method: 'PATCH',
                    headers: expect.any(Object),
                    body: JSON.stringify(['u1', 'u2'])
                })
            );
        });

        it('Debería lanzar HttpException si el backend rechaza la operación', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(400, 'Participante inválido'));

            await expect(eventoClient.agregarParticipantes('oc-1', ['u1'])).rejects.toThrow(HttpException);
        });
    });

    describe('borrarParticipante', () => {
        it('Debería hacer PATCH a /ocurrencias/:id/BParticipantes y devolver el EventoViewModel', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, eventoViewModelMock));

            const result = await eventoClient.borrarParticipante('oc-1', 'u1');

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockBaseUrl}/api/Eventos/ocurrencias/oc-1/BParticipantes`,
                expect.objectContaining({
                    method: 'PATCH',
                    headers: expect.any(Object),
                    body: JSON.stringify({ usuarioId: 'u1' })
                })
            );
            expect(result).toEqual(eventoViewModelMock);
        });

        it('Debería lanzar HttpException si el participante no existe en la ocurrencia', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(404, 'No encontrado'));

            await expect(eventoClient.borrarParticipante('oc-1', 'u-x')).rejects.toThrow(HttpException);
        });
    });

    describe('getConFiltros', () => {
        it('Debería transformar el DTO a Query Params y hacer GET a /api/eventos/filtrar', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(200, [eventoViewModelMock]));

            const result = await eventoClient.getConFiltros(filtrosEventoDtoMock);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining(`${mockBaseUrl}/api/Eventos/filtros?page=1&categoria=Acad%C3%A9mico`),
                expect.objectContaining({
                    headers: expect.any(Object)
                })
            );
            expect(result).toEqual([eventoViewModelMock]);
        });

        it('Debería lanzar HttpException si el backend rechaza el filtrado', async () => {
            jest.mocked(global.fetch).mockResolvedValueOnce(createFetchResponse(500, 'Error interno'));

            await expect(eventoClient.getConFiltros(filtrosEventoDtoMock)).rejects.toThrow(HttpException);
        });
    });
});