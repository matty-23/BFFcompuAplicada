import { jest } from "@jest/globals";
import { IUsuarioClient } from "../../../src/interfaces/IUsuarioClient";

export const mockUsuarioClient: jest.Mocked<IUsuarioClient> = {
  obtenerUsuario: jest.fn(),
  listarUsuarios: jest.fn(),
  actualizarUsuario: jest.fn(),
  eliminarUsuario: jest.fn(),
  actualizarContraseña: jest.fn(),
};