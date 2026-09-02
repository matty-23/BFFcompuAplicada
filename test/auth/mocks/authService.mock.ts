import { jest } from "@jest/globals";
import { IAuthClient } from "../../../src/interfaces/IAuthClient"; 

export const mockAuthClient: jest.Mocked<IAuthClient> = {
    registrarUsuario: jest.fn(),
    iniciarSesion: jest.fn(),
    validarSesion: jest.fn(),
    cerrarSesion: jest.fn(),
    solicitarRecuperacion: jest.fn(),
    restablecerContrasena: jest.fn(),
}; 