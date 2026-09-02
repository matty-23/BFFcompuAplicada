import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../../src/services/AuthService';
import { mockAuthClient} from '../mocks/authService.mock';
import { registrarUsuarioDtoMock, loginUsuarioDtoMock, correoRecuperacionDtoMock, restablecerContrasenaDtoMock } from '../../models/auth.modelo';
import { CoreResponseBad, CoreResponseOk, headersMock } from '../../models/core.response'; //[cite: 3]

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockAuthClient);
    });

    describe('registrarUsuario', () => {
        it('Debería registrar un usuario exitosamente (200)', async () => {
            mockAuthClient.registrarUsuario.mockResolvedValue(CoreResponseOk({ id: '1', ...registrarUsuarioDtoMock }));

            const result = await authService.registrarUsuario(registrarUsuarioDtoMock, headersMock); //[cite: 1]
            
            expect(result.status).toEqual(200);
            expect(result.data.id).toEqual('1');
            expect(mockAuthClient.registrarUsuario).toHaveBeenCalledWith(registrarUsuarioDtoMock, headersMock);
        });

        it('Debería retornar error manejado por el backend (Ej. 400 Email duplicado)', async () => {
            mockAuthClient.registrarUsuario.mockResolvedValue(CoreResponseBad());

            const result = await authService.registrarUsuario(registrarUsuarioDtoMock, headersMock);
            
            expect(result.status).toEqual(400);
            expect(mockAuthClient.registrarUsuario).toHaveBeenCalledWith(registrarUsuarioDtoMock, headersMock);
        });

        it('Debería lanzar error si el BFF falla con una excepción inesperada', async () => {
            const errorInesperado = new Error('Error de red');
            mockAuthClient.registrarUsuario.mockRejectedValue(errorInesperado);

            await expect(authService.registrarUsuario(registrarUsuarioDtoMock, headersMock))
                .rejects.toThrow('Error de red');
        });
    });

    describe('iniciarSesion', () => {
        it('Debería iniciar sesión exitosamente (200) y retornar cookies', async () => {
            const cookiesSision = ['sessionId=12345; HttpOnly'];
            mockAuthClient.iniciarSesion.mockResolvedValue(CoreResponseOk({ token: 'abc' }, cookiesSision));

            const result = await authService.iniciarSesion(loginUsuarioDtoMock, headersMock); //[cite: 1]
            
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
            mockAuthClient.iniciarSesion.mockRejectedValue(new HttpException('Error', HttpStatus.BAD_GATEWAY));

            await expect(authService.iniciarSesion(loginUsuarioDtoMock, headersMock))
                .rejects.toThrow(HttpException);
        });
    });

    describe('validarSesion', () => {
        it('Debería validar la sesión exitosamente', async () => {
            mockAuthClient.validarSesion.mockResolvedValue(CoreResponseOk({ valid: true }));

            const result = await authService.validarSesion(headersMock); //[cite: 1]
            
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

            await expect(authService.validarSesion(headersMock)).rejects.toThrow('Fallo interno');
        });
    });

    describe('cerrarSesion', () => {
        it('Debería cerrar sesión exitosamente', async () => {
            mockAuthClient.cerrarSesion.mockResolvedValue(CoreResponseOk({ success: true }));

            const result = await authService.cerrarSesion(headersMock); //[cite: 1]
            
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

            const result = await authService.solicitarRecuperacion(correoRecuperacionDtoMock, headersMock); //[cite: 1]
            
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

            await expect(authService.solicitarRecuperacion(correoRecuperacionDtoMock, headersMock)).rejects.toThrow('Error SMTP');
        });
    });

    describe('restablecerContrasena', () => {
        it('Debería restablecer la contraseña exitosamente', async () => {
            mockAuthClient.restablecerContrasena.mockResolvedValue(CoreResponseOk({ success: true }));

            const result = await authService.restablecerContrasena(restablecerContrasenaDtoMock, headersMock); //[cite: 1]
            
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

            await expect(authService.restablecerContrasena(restablecerContrasenaDtoMock, headersMock)).rejects.toThrow('Fatal error');
        });
    });
});