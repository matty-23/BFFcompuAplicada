import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsuarioService } from '../../../src/services/UsuarioService';
import { mockUsuarioClient } from '../mocks/usuarioService.mock';
import { usuarioModelo, usuarioModeloActualizado } from '../../models/usuario.modelo';
import { CoreResponseBad, CoreResponseOk, headersMock } from '../../models/core.response';
import { CambiarContraseñaDTO } from '../../../src/DTO/AuthUsuarioDTO';
import { GetUsuariosQueryDTO } from '../../../src/DTO/UsuarioDTO';

describe('UsuarioService', () => {
    let usuarioService: UsuarioService;

    beforeEach(() => {
        jest.clearAllMocks();
        usuarioService = new UsuarioService(mockUsuarioClient);
    });

    describe('obtenerUsuario', () => {
        it('Debería retornar un usuario exitosamente (200)', async () => {
            mockUsuarioClient.obtenerUsuario.mockResolvedValue(CoreResponseOk(usuarioModelo));

            const result = await usuarioService.obtenerUsuario(headersMock, '1');

            expect(result.data).toEqual(usuarioModelo);
            expect(result.status).toEqual(200);
            expect(result.cookies).toEqual([]);
            expect(mockUsuarioClient.obtenerUsuario).toHaveBeenCalledWith(headersMock, '1');
            expect(mockUsuarioClient.obtenerUsuario).toHaveBeenCalledTimes(1);
        });

        it('Debería lanzar error si el BFF falla con una excepción inesperada', async () => {
            const errorInesperado = new Error('Error interno inesperado en el BFF');
            mockUsuarioClient.obtenerUsuario.mockRejectedValue(errorInesperado);

            await expect(usuarioService.obtenerUsuario(headersMock, '1')).rejects.toThrow('Error interno inesperado en el BFF');
            expect(mockUsuarioClient.obtenerUsuario).toHaveBeenCalledWith(headersMock, '1');
        });

        it('Debería retornar error manejado por el backend (Ej. 400)', async () => {
            mockUsuarioClient.obtenerUsuario.mockResolvedValue(CoreResponseBad());

            const result = await usuarioService.obtenerUsuario(headersMock, '1');

            expect(result).toEqual(CoreResponseBad());
            expect(result.status).toEqual(400);
            expect(result.cookies).toEqual([]);
            expect(mockUsuarioClient.obtenerUsuario).toHaveBeenCalledWith(headersMock, '1');
        });
    });

    describe('actualizarUsuario', () => {
        it('Debería actualizar un usuario exitosamente (200)', async () => {
            mockUsuarioClient.actualizarUsuario.mockResolvedValue(CoreResponseOk(usuarioModeloActualizado));

            const result = await usuarioService.actualizarUsuario(usuarioModeloActualizado, headersMock);

            expect(result.data).toEqual(usuarioModeloActualizado);
            expect(result.status).toEqual(200);
            expect(result.cookies).toEqual([]);
            expect(mockUsuarioClient.actualizarUsuario).toHaveBeenCalledWith(usuarioModeloActualizado, headersMock);
        });

        it('Debería lanzar HttpException si ocurre un error inesperado (Ej. 502 BAD_GATEWAY)', async () => {
            const errorHttp = new HttpException({ message: 'Error inesperado' }, HttpStatus.BAD_GATEWAY);
            mockUsuarioClient.actualizarUsuario.mockRejectedValue(errorHttp);

            await expect(usuarioService.actualizarUsuario(usuarioModeloActualizado, headersMock))
                .rejects.toThrow(errorHttp);
            expect(mockUsuarioClient.actualizarUsuario).toHaveBeenCalledWith(usuarioModeloActualizado, headersMock);
        });

        it('Debería retornar error manejado por el backend (Ej. 400)', async () => {
            mockUsuarioClient.actualizarUsuario.mockResolvedValue(CoreResponseBad());

            const result = await usuarioService.actualizarUsuario(usuarioModeloActualizado, headersMock);

            expect(result).toEqual(CoreResponseBad());
            expect(result.status).toEqual(400);
            expect(mockUsuarioClient.actualizarUsuario).toHaveBeenCalledWith(usuarioModeloActualizado, headersMock);
        });
    });

    describe('obtenerUsuarios', () => {
        it('Debería listar usuarios exitosamente', async () => {
            const listaUsuarios = [usuarioModelo, usuarioModeloActualizado];
            // Fix: usar mockUsuarioClient.obtenerUsuarios o el método de la interfaz que corresponda.
            // Según IUsuarioService, el método es listarUsuarios en Client o el equivalente. 
            // Asumimos listarUsuarios por la implementación previa.
            mockUsuarioClient.listarUsuarios.mockResolvedValue(CoreResponseOk(listaUsuarios));

            const result = await usuarioService.obtenerUsuarios(headersMock);

            expect(result.data).toEqual(listaUsuarios);
            expect(result.status).toEqual(200);
            expect(mockUsuarioClient.listarUsuarios).toHaveBeenCalledWith(headersMock); // O el mapeo que haga el Service
        });

        it('Debería lanzar error si falla inesperadamente', async () => {
            mockUsuarioClient.listarUsuarios.mockRejectedValue(new Error('Falla de red'));

            await expect(usuarioService.obtenerUsuarios(headersMock)).rejects.toThrow('Falla de red');
        });
        it('Debería retornar error manejado por el backend (Ej. 400) al obtener usuarios', async () => {
            mockUsuarioClient.listarUsuarios.mockResolvedValue(CoreResponseBad());

            const result = await usuarioService.obtenerUsuarios(headersMock);

            expect(result).toEqual(CoreResponseBad());
            expect(result.status).toEqual(400);
            expect(mockUsuarioClient.listarUsuarios).toHaveBeenCalledWith(headersMock);
        });
    });

    describe('listarUsuarios (con filtros)', () => {
        const filtrosMock: GetUsuariosQueryDTO = { orden: 'asc', ordenar: 'nombre', limit: 10, skip: 0 };
        it('Debería listar usuarios con filtros aplicados exitosamente', async () => {
            mockUsuarioClient.listarUsuarios.mockResolvedValue(CoreResponseOk([usuarioModelo]));

            const result = await usuarioService.listarUsuarios(headersMock, filtrosMock);

            expect(result.status).toEqual(200);
            expect(result.data).toEqual([usuarioModelo]);
        });

        it('Debería manejar respuesta de error (Ej. 400) al aplicar filtros inválidos', async () => {
            mockUsuarioClient.listarUsuarios.mockResolvedValue(CoreResponseBad());

            const result = await usuarioService.listarUsuarios(headersMock, filtrosMock);

            expect(result.status).toEqual(400);
        });
        it('Debería lanzar error si el BFF falla con una excepción inesperada al listar con filtros', async () => {
            mockUsuarioClient.listarUsuarios.mockRejectedValue(new Error('Error de conexión con BFF'));

            await expect(usuarioService.listarUsuarios(headersMock, filtrosMock)).rejects.toThrow('Error de conexión con BFF');
        });
    });

    describe('actualizarContraseña', () => {
        const cambioContraseñaPayload: CambiarContraseñaDTO = {
            id: '1',
            currentPassword: 'oldPassword123',
            newPassword: 'newPassword123',
            revokeOtherSessions: true
        };

        it('Debería actualizar la contraseña exitosamente', async () => {
            mockUsuarioClient.actualizarContraseña.mockResolvedValue(CoreResponseOk({ success: true }));

            const result = await usuarioService.actualizarContraseña(cambioContraseñaPayload, headersMock);

            expect(result.status).toEqual(200);
            expect(result.data).toEqual({ success: true });
            expect(mockUsuarioClient.actualizarContraseña).toHaveBeenCalledWith(cambioContraseñaPayload, headersMock);
        });

        it('Debería lanzar error si la actualización de contraseña es rechazada por excepción', async () => {
            const errorAuth = new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
            mockUsuarioClient.actualizarContraseña.mockRejectedValue(errorAuth);

            await expect(usuarioService.actualizarContraseña(cambioContraseñaPayload, headersMock))
                .rejects.toThrow(errorAuth);
        });
        it('Debería retornar error manejado por el backend (Ej. 400 Contraseña incorrecta)', async () => {
            mockUsuarioClient.actualizarContraseña.mockResolvedValue(CoreResponseBad());

            const result = await usuarioService.actualizarContraseña(cambioContraseñaPayload, headersMock);

            expect(result).toEqual(CoreResponseBad());
            expect(result.status).toEqual(400);
            expect(mockUsuarioClient.actualizarContraseña).toHaveBeenCalledWith(cambioContraseñaPayload, headersMock);
        });
    });

    describe('eliminarUsuario', () => {
        it('Debería eliminar el usuario de manera exitosa', async () => {
            mockUsuarioClient.eliminarUsuario.mockResolvedValue(CoreResponseOk({ deleted: true }));

            const result = await usuarioService.eliminarUsuario(headersMock, '1');

            expect(result.status).toEqual(200);
            expect(mockUsuarioClient.eliminarUsuario).toHaveBeenCalledWith(headersMock, '1');
        });

        it('Debería manejar respuesta con error desde el cliente (Ej. 404 Usuario no encontrado)', async () => {
            mockUsuarioClient.eliminarUsuario.mockResolvedValue({ status: 404, data: null, cookies: [] });

            const result = await usuarioService.eliminarUsuario(headersMock, '1');

            expect(result.status).toEqual(404);
            expect(mockUsuarioClient.eliminarUsuario).toHaveBeenCalledWith(headersMock, '1');
        });
        it('Debería lanzar error si falla inesperadamente al intentar eliminar', async () => {
            const errorInesperado = new Error('Timeout al eliminar');
            mockUsuarioClient.eliminarUsuario.mockRejectedValue(errorInesperado);

            await expect(usuarioService.eliminarUsuario(headersMock, '1')).rejects.toThrow(errorInesperado);
            expect(mockUsuarioClient.eliminarUsuario).toHaveBeenCalledWith(headersMock, '1');
        });
    });
});