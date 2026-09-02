import { jest } from "@jest/globals";
import { ICorreoClient } from "../../../src/interfaces/ICorreoClient";

export const mockCorreoClient: jest.Mocked<ICorreoClient> = {
    enviarNotificacion: jest.fn(),
    enviarCorreoCuenta: jest.fn(),
    enviarCorreoConfirmacionSolicitud: jest.fn(),
};