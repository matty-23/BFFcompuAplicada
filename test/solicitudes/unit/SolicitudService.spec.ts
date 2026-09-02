import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SolicitudService } from '../../../src/services/SolicitudService';
import { mockSolicitudClient } from '../mocks/solicitudService.mock';
import {solicitudViewModelMock, crearSolicitudDtoMock, modificarSolicitudDtoMock, aceptarSolicitudDtoMock,rechazarSolicitudDtoMock, filtrosSolicitudDtoMock} from '../../models/solicitud.modelo';

describe('SolicitudService', () => {
    let solicitudService: SolicitudService;

    beforeEach(() => {
        jest.clearAllMocks();
        solicitudService = new SolicitudService(mockSolicitudClient);
    });

    describe('crear', () => {
        it('Debería crear una solicitud exitosamente', async () => {
            mockSolicitudClient.crear.mockResolvedValue(solicitudViewModelMock);

            const result = await solicitudService.crear(crearSolicitudDtoMock); //[cite: 1]
            
            expect(result).toEqual(solicitudViewModelMock);
            expect(mockSolicitudClient.crear).toHaveBeenCalledWith(crearSolicitudDtoMock);
        });

        it('Debería lanzar error si el cliente falla al crear', async () => {
            // El mock lanza un Error genérico
            mockSolicitudClient.crear.mockRejectedValue(new Error('Error de base de datos'));

            // Esperamos simplemente que el error lanzado contenga ese string
            await expect(solicitudService.crear(crearSolicitudDtoMock))
                .rejects.toThrow('Error de base de datos');
        });
    });

    describe('obtenerPorId', () => {
        it('Debería retornar una solicitud si existe', async () => {
            mockSolicitudClient.obtenerPorId.mockResolvedValue(solicitudViewModelMock);

            const result = await solicitudService.obtenerPorId('sol-1'); //[cite: 1]
            
            expect(result).toEqual(solicitudViewModelMock);
            expect(mockSolicitudClient.obtenerPorId).toHaveBeenCalledWith('sol-1');
        });

        it('Debería retornar null si la solicitud no existe', async () => {
            mockSolicitudClient.obtenerPorId.mockResolvedValue(null);

            const result = await solicitudService.obtenerPorId('sol-999');
            
            expect(result).toBeNull();
        });
    });

    describe('listar', () => {
        it('Debería listar solicitudes usando filtros y paginación', async () => {
            mockSolicitudClient.listar.mockResolvedValue([solicitudViewModelMock]);

            const result = await solicitudService.listar(filtrosSolicitudDtoMock, 2); //[cite: 1]
            
            expect(result).toEqual([solicitudViewModelMock]);
            expect(mockSolicitudClient.listar).toHaveBeenCalledWith(filtrosSolicitudDtoMock, 2);
        });
    });

    describe('listarMias', () => {
        it('Debería listar las solicitudes del usuario actual delegando a listarPorUsuario', async () => {
            mockSolicitudClient.listarPorUsuario.mockResolvedValue([solicitudViewModelMock]);

            // Nota: ISolicitudService expone 'listarMias', pero el cliente usa 'listarPorUsuario'[cite: 1]
            const result = await solicitudService.listarMias(1); 
            
            expect(result).toEqual([solicitudViewModelMock]);
            expect(mockSolicitudClient.listarPorUsuario).toHaveBeenCalledWith(1);
        });
    });

    describe('modificar', () => {
        it('Debería modificar una solicitud exitosamente', async () => {
            mockSolicitudClient.modificar.mockResolvedValue({ ok: true });

            const result = await solicitudService.modificar('sol-1', modificarSolicitudDtoMock); //[cite: 1]
            
            expect(result).toEqual({ ok: true });
            expect(mockSolicitudClient.modificar).toHaveBeenCalledWith('sol-1', modificarSolicitudDtoMock);
        });
    });

    describe('cancelar', () => {
        it('Debería cancelar la solicitud exitosamente', async () => {
            mockSolicitudClient.cancelar.mockResolvedValue({ ok: true });

            const result = await solicitudService.cancelar('sol-1'); //[cite: 1]
            
            expect(result).toEqual({ ok: true });
            expect(mockSolicitudClient.cancelar).toHaveBeenCalledWith('sol-1');
        });
    });

    describe('aceptar y rechazar', () => {
        it('Debería aceptar la solicitud', async () => {
            mockSolicitudClient.aceptar.mockResolvedValue({ ok: true });

            const result = await solicitudService.aceptar('sol-1', aceptarSolicitudDtoMock); //[cite: 1]
            
            expect(result).toEqual({ ok: true });
        });

        it('Debería rechazar la solicitud con motivo', async () => {
            mockSolicitudClient.rechazar.mockResolvedValue({ ok: true });

            const result = await solicitudService.rechazar('sol-1', rechazarSolicitudDtoMock); //[cite: 1]
            
            expect(result).toEqual({ ok: true });
            expect(mockSolicitudClient.rechazar).toHaveBeenCalledWith('sol-1', rechazarSolicitudDtoMock);
        });
    });
});