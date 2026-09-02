import { jest } from "@jest/globals";
import { IEventoClient } from "../../../src/interfaces/IEventoClient";

export const mockEventoClient: jest.Mocked<IEventoClient> = {
    getAll: jest.fn(),
    getById: jest.fn(),
    crearMono: jest.fn(),
    crearMulti: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
    actualizarOcurrencia: jest.fn(),
    agregarParticipantes: jest.fn(),
    borrarParticipante: jest.fn(),
    getConFiltros: jest.fn(),
};