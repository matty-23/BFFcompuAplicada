import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CorreoService } from '../../../src/services/CorreoService';
import { mockCorreoClient } from '../mocks/correoService.mock';
import { correoDtoMock, correoConfirmacionCuentaDtoMock } from '../../models/correo.modelo';
import { headersMock } from '../../models/core.response';

describe('CorreoService', () => {
    let correoService: CorreoService;

    beforeEach(() => {
        jest.clearAllMocks();
        correoService = new CorreoService(mockCorreoClient);
    });

    describe('enviarNotificacion', () => {
        it('Debería enviar una notificación exitosamente devolviendo true', async () => {
            mockCorreoClient.enviarNotificacion.mockResolvedValue(true);

            const result = await correoService.enviarNotificacion(correoDtoMock, headersMock);
            
            expect(result).toBe(true);
            expect(mockCorreoClient.enviarNotificacion).toHaveBeenCalledWith(correoDtoMock, headersMock);
        });

        it('Debería retornar false si el cliente falla controladamente', async () => {
            mockCorreoClient.enviarNotificacion.mockResolvedValue(false);

            const result = await correoService.enviarNotificacion(correoDtoMock, headersMock);
            
            expect(result).toBe(false);
        });

        it('Debería lanzar error si hay una excepción inesperada', async () => {
            mockCorreoClient.enviarNotificacion.mockRejectedValue(new Error('Falla SMTP'));

            await expect(correoService.enviarNotificacion(correoDtoMock, headersMock))
                .rejects.toThrow(new HttpException('Falla SMTP', HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });

    describe('enviarCorreoConfirmacionCuenta', () => {
        it('Debería enviar el correo de confirmación de cuenta exitosamente', async () => {
            mockCorreoClient.enviarCorreoCuenta.mockResolvedValue(true);

            const result = await correoService.enviarCorreoConfirmacionCuenta(correoConfirmacionCuentaDtoMock, headersMock);
            
            expect(result).toBe(true);
            expect(mockCorreoClient.enviarCorreoCuenta).toHaveBeenCalledWith(correoConfirmacionCuentaDtoMock, headersMock);
        });

        it('Debería propagar excepciones del cliente como HttpException', async () => {
            mockCorreoClient.enviarCorreoCuenta.mockRejectedValue(new Error('Timeout'));

            await expect(correoService.enviarCorreoConfirmacionCuenta(correoConfirmacionCuentaDtoMock, headersMock))
                .rejects.toThrow(new HttpException('Timeout', HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });

    describe('enviarCorreoConfirmacionSolicitudAEvento', () => {
        it('Debería enviar el correo de confirmación de solicitud exitosamente', async () => {
            mockCorreoClient.enviarCorreoConfirmacionSolicitud.mockResolvedValue(true);

            const result = await correoService.enviarCorreoConfirmacionSolicitudAEvento(correoDtoMock, headersMock);
            
            expect(result).toBe(true);
            expect(mockCorreoClient.enviarCorreoConfirmacionSolicitud).toHaveBeenCalledWith(correoDtoMock, headersMock);
        });
    });
});