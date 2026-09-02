import { jest } from "@jest/globals";
import { ISolicitudClient } from "../../../src/interfaces/ISolicitudClient"; //[cite: 1]

export const mockSolicitudClient: jest.Mocked<ISolicitudClient> = {
    crear: jest.fn(),
    obtenerPorId: jest.fn(),
    listar: jest.fn(),
    listarPorUsuario: jest.fn(),
    modificar: jest.fn(),
    cancelar: jest.fn(),
    aceptar: jest.fn(),
    rechazar: jest.fn(),
};