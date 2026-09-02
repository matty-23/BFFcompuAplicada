import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';
import { EventoClient } from '../../../src/client/EventoClient';
import { eventoViewModelMock, crearEventoMultiDtoMock, actualizarEventoDtoMock, filtrosEventoDtoMock } from '../../models/evento.modelo';
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
    });
});