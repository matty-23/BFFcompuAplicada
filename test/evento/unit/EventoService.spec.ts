import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EventoService } from '../../../src/services/EventoService';
import { mockEventoClient } from '../mocks/eventoService.mock';
import { eventoViewModelMock, crearEventoMultiDtoMock, actualizarEventoDtoMock, actualizarOcurrenciaDtoMock, filtrosEventoDtoMock } from '../../models/evento.modelo';

describe('EventoService', () => {
    let eventoService: EventoService;

    beforeEach(() => {
        jest.clearAllMocks();
        eventoService = new EventoService(mockEventoClient);
    });

    describe('getEventos', () => {
        it('Debería obtener un listado de eventos exitosamente', async () => {
            mockEventoClient.getAll.mockResolvedValue([eventoViewModelMock]);

            const result = await eventoService.getEventos();
            
            expect(result).toEqual([eventoViewModelMock]);
            expect(mockEventoClient.getAll).toHaveBeenCalled();
        });

        it('Debería lanzar HttpException en caso de error de red', async () => {
            mockEventoClient.getAll.mockRejectedValue(new Error('Fallo de base de datos'));

            await expect(eventoService.getEventos()).rejects.toThrow('Fallo de base de datos');
        });
    });

    describe('crearEventoMulti', () => {
        it('Debería crear un evento múltiple delegando a crearMulti', async () => {
            mockEventoClient.crearMulti.mockResolvedValue(eventoViewModelMock);

            const result = await eventoService.crearEventoMulti(crearEventoMultiDtoMock);
            
            expect(result).toEqual(eventoViewModelMock);
            expect(mockEventoClient.crearMulti).toHaveBeenCalledWith(crearEventoMultiDtoMock);
        });
    });

    describe('actualizarEvento', () => {
        it('Debería actualizar un evento exitosamente (void)', async () => {
            mockEventoClient.actualizar.mockResolvedValue(undefined);

            await expect(eventoService.actualizarEvento('1', actualizarEventoDtoMock)).resolves.not.toThrow();
            expect(mockEventoClient.actualizar).toHaveBeenCalledWith('1', actualizarEventoDtoMock);
        });
    });

    describe('eliminarEvento', () => {
        it('Debería eliminar eventos recibiendo un array de IDs', async () => {
            mockEventoClient.eliminar.mockResolvedValue(undefined);

            await expect(eventoService.eliminarEvento(['1', '2'])).resolves.not.toThrow();
            expect(mockEventoClient.eliminar).toHaveBeenCalledWith(['1', '2']);
        });
    });

    describe('actualizarOcurrencia', () => {
        it('Debería actualizar la ocurrencia y devolver el EventoViewModel', async () => {
            mockEventoClient.actualizarOcurrencia.mockResolvedValue(eventoViewModelMock);

            const result = await eventoService.actualizarOcurrencia('1', 'oc-1', actualizarOcurrenciaDtoMock);
            
            expect(result).toEqual(eventoViewModelMock);
            expect(mockEventoClient.actualizarOcurrencia).toHaveBeenCalledWith('1', 'oc-1', actualizarOcurrenciaDtoMock);
        });
    });

    describe('filtrado', () => {
        it('Debería delegar el filtrado a getConFiltros', async () => {
            mockEventoClient.getConFiltros.mockResolvedValue([eventoViewModelMock]);

            const result = await eventoService.filtrado(filtrosEventoDtoMock);
            
            expect(result).toEqual([eventoViewModelMock]);
            expect(mockEventoClient.getConFiltros).toHaveBeenCalledWith(filtrosEventoDtoMock);
        });

        it('Debería asignar página 1 por defecto si no se especifica', async () => {
            mockEventoClient.getConFiltros.mockResolvedValue([eventoViewModelMock]);
            const filtrosSinPage = { categoria: 'Académico' };

            await eventoService.filtrado(filtrosSinPage as typeof filtrosEventoDtoMock);

            expect(mockEventoClient.getConFiltros).toHaveBeenCalledWith(
                expect.objectContaining({ page: 1 })
            );
        });
    });

    describe('getEventoById', () => {
        it('Debería obtener un evento por id exitosamente', async () => {
            mockEventoClient.getById.mockResolvedValue(eventoViewModelMock);

            const result = await eventoService.getEventoById('1');

            expect(result).toEqual(eventoViewModelMock);
            expect(mockEventoClient.getById).toHaveBeenCalledWith('1');
        });

        it('Debería retornar null si el evento no existe', async () => {
            mockEventoClient.getById.mockResolvedValue(null);

            const result = await eventoService.getEventoById('inexistente');

            expect(result).toBeNull();
        });

        it('Debería propagar el error si el cliente falla', async () => {
            mockEventoClient.getById.mockRejectedValue(new Error('Error de red'));

            await expect(eventoService.getEventoById('1')).rejects.toThrow('Error de red');
        });
    });

    describe('agregarParticipantes', () => {
        it('Debería agregar participantes a una ocurrencia (void)', async () => {
            mockEventoClient.agregarParticipantes.mockResolvedValue(undefined);

            await expect(eventoService.agregarParticipantes('oc-1', ['u1', 'u2'])).resolves.not.toThrow();
            expect(mockEventoClient.agregarParticipantes).toHaveBeenCalledWith('oc-1', ['u1', 'u2']);
        });

        it('Debería propagar el error si el cliente falla', async () => {
            mockEventoClient.agregarParticipantes.mockRejectedValue(new Error('Participante inválido'));

            await expect(eventoService.agregarParticipantes('oc-1', ['u1'])).rejects.toThrow('Participante inválido');
        });
    });

    describe('borrarParticipante', () => {
        it('Debería borrar un participante y devolver el EventoViewModel', async () => {
            mockEventoClient.borrarParticipante.mockResolvedValue(eventoViewModelMock);

            const result = await eventoService.borrarParticipante('oc-1', 'u1');

            expect(result).toEqual(eventoViewModelMock);
            expect(mockEventoClient.borrarParticipante).toHaveBeenCalledWith('oc-1', 'u1');
        });

        it('Debería propagar el error si el cliente falla', async () => {
            mockEventoClient.borrarParticipante.mockRejectedValue(new Error('No encontrado'));

            await expect(eventoService.borrarParticipante('oc-1', 'u-x')).rejects.toThrow('No encontrado');
        });
    });
});