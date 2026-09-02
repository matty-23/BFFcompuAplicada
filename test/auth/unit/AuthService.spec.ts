import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../../src/services/AuthService';
import {registrarUsuarioDtoMock, loginUsuarioDtoMock, correoRecuperacionDtoMock, restablecerContrasenaDtoMock } from '../../models/auth.modelo';
import { mockAuthClient } from '../mocks/authService.mock';
import { CoreResponseBad, CoreResponseOk, headersMock } from '../../models/core.response';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockAuthClient);
    });

    describe('registrarUsuario', () => {
        it('Debería registrar un usuario exitosamente (201)', async () => {
            mockAuthClient.registrarUsuario.mockResolvedValue({ status: 201, data: { id: '1' }, cookies: [] });

            const result = await authService.registrarUsuario(registrarUsuarioDtoMock, headersMock);
            
            expect(result.status).toEqual(201);
            
            expect(result.data).toEqual({
                auth: { 
                    id: '1' 
                },
                usuario: {
                    id: '1',
                    nombre: registrarUsuarioDtoMock.name,
                    apellido: registrarUsuarioDtoMock.apellido,
                    correo: registrarUsuarioDtoMock.email,
                    departamento: registrarUsuarioDtoMock.departamento,
                    rol: undefined
                }
            });
            
            expect(mockAuthClient.registrarUsuario).toHaveBeenCalledWith(registrarUsuarioDtoMock, headersMock);
        });

        it('Debería retornar error manejado por el backend (Ej. 400 Email duplicado)', async () => {
            mockAuthClient.registrarUsuario.mockResolvedValue(CoreResponseBad());

            const result = await authService.registrarUsuario(registrarUsuarioDtoMock, headersMock);
            
            expect(result.status).toEqual(400);
            expect(mockAuthClient.registrarUsuario).toHaveBeenCalledWith(registrarUsuarioDtoMock, headersMock);
        });

        it('Debería lanzar error si el BFF falla con una excepción inesperada', async () => {
            mockAuthClient.registrarUsuario.mockRejectedValue(new Error('Error de red'));

            await expect(authService.registrarUsuario(registrarUsuarioDtoMock, headersMock))
                .rejects.toThrow(new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });

    describe('iniciarSesion', () => {
        it('Debería iniciar sesión exitosamente (200) y retornar cookies', async () => {
            const cookiesSision = ['sessionId=12345; HttpOnly'];
            mockAuthClient.iniciarSesion.mockResolvedValue(CoreResponseOk({ token: 'abc' }, cookiesSision));

            const result = await authService.iniciarSesion(loginUsuarioDtoMock, headersMock);
            
            expect(result.status).toEqual(200);
            expect(result.cookies).toEqual(cookiesSision);
            expect(mockAuthClient.iniciarSesion).toHaveBeenCalledWith(loginUsuarioDtoMock, headersMock);
        });

        it('Debería retornar error manejado por el backend (Ej. 401 Credenciales inválidas)', async () => {
            mockAuthClient.iniciarSesion.mockResolvedValue({ status: 401, data: null, cookies: [] });

            const result = await authService.iniciarSesion(loginUsuarioDtoMock, headersMock);
            
            expect(result.status).toEqual(401);
            expect(mockAuthClient.iniciarSesion).toHaveBeenCalledWith(loginUsuarioDtoMock, headersMock);
        });

        it('Debería lanzar error por excepción inesperada', async () => {
            const errorHttp = new HttpException('Error', HttpStatus.BAD_GATEWAY);
            mockAuthClient.iniciarSesion.mockRejectedValue(errorHttp);

            await expect(authService.iniciarSesion(loginUsuarioDtoMock, headersMock))
                .rejects.toThrow(errorHttp);
        });
    });

    describe('validarSesion', () => {
        it('Debería validar la sesión exitosamente', async () => {
            mockAuthClient.validarSesion.mockResolvedValue(CoreResponseOk({ valid: true }));

            const result = await authService.validarSesion(headersMock);
            
            expect(result.status).toEqual(200);
            expect(result.data.valid).toBe(true);
        });

        it('Debería retornar 401 si la sesión es inválida', async () => {
            mockAuthClient.validarSesion.mockResolvedValue({ status: 401, data: null, cookies: [] });

            const result = await authService.validarSesion(headersMock);
            
            expect(result.status).toEqual(401);
        });

        it('Debería lanzar error en caso de fallo del sistema', async () => {
            mockAuthClient.validarSesion.mockRejectedValue(new Error('Fallo interno'));

            // Asumiendo que validarSesion no tiene el try/catch que formatea a HttpException,
            // de lo contrario, cambialo por el new HttpException igual que los de arriba.
            await expect(authService.validarSesion(headersMock)).rejects.toThrow('Fallo interno');
        });
    });

    describe('cerrarSesion', () => {
        it('Debería cerrar sesión exitosamente', async () => {
            mockAuthClient.cerrarSesion.mockResolvedValue(CoreResponseOk({ success: true }));

            const result = await authService.cerrarSesion(headersMock);
            
            expect(result.status).toEqual(200);
        });

        it('Debería retornar error si falla de forma controlada', async () => {
            mockAuthClient.cerrarSesion.mockResolvedValue(CoreResponseBad());

            const result = await authService.cerrarSesion(headersMock);
            
            expect(result.status).toEqual(400);
        });

        it('Debería lanzar excepción si se rompe la comunicación', async () => {
            mockAuthClient.cerrarSesion.mockRejectedValue(new Error('Timeout'));

            await expect(authService.cerrarSesion(headersMock)).rejects.toThrow('Timeout');
        });
    });

    describe('solicitarRecuperacion', () => {
        it('Debería solicitar la recuperación exitosamente', async () => {
            mockAuthClient.solicitarRecuperacion.mockResolvedValue(CoreResponseOk({ sent: true }));

            const result = await authService.solicitarRecuperacion(correoRecuperacionDtoMock, headersMock);
            
            expect(result.status).toEqual(200);
            expect(mockAuthClient.solicitarRecuperacion).toHaveBeenCalledWith(correoRecuperacionDtoMock, headersMock);
        });

        it('Debería manejar respuesta de error (Ej. 404 Email no encontrado)', async () => {
            mockAuthClient.solicitarRecuperacion.mockResolvedValue({ status: 404, data: null, cookies: [] });

            const result = await authService.solicitarRecuperacion(correoRecuperacionDtoMock, headersMock);
            
            expect(result.status).toEqual(404);
        });

        it('Debería propagar errores inesperados', async () => {
            mockAuthClient.solicitarRecuperacion.mockRejectedValue(new Error('Error SMTP'));

            await expect(authService.solicitarRecuperacion(correoRecuperacionDtoMock, headersMock))
                .rejects.toThrow(new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });

    describe('restablecerContrasena', () => {
        it('Debería restablecer la contraseña exitosamente', async () => {
            mockAuthClient.restablecerContrasena.mockResolvedValue(CoreResponseOk({ success: true }));

            const result = await authService.restablecerContrasena(restablecerContrasenaDtoMock, headersMock);
            
            expect(result.status).toEqual(200);
            expect(mockAuthClient.restablecerContrasena).toHaveBeenCalledWith(restablecerContrasenaDtoMock, headersMock);
        });

        it('Debería manejar token inválido o expirado (400)', async () => {
            mockAuthClient.restablecerContrasena.mockResolvedValue(CoreResponseBad());

            const result = await authService.restablecerContrasena(restablecerContrasenaDtoMock, headersMock);
            
            expect(result.status).toEqual(400);
        });

        it('Debería propagar excepciones', async () => {
            mockAuthClient.restablecerContrasena.mockRejectedValue(new Error('Fatal error'));

            await expect(authService.restablecerContrasena(restablecerContrasenaDtoMock, headersMock))
                .rejects.toThrow(new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });
});