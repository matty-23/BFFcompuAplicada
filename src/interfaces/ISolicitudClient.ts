import { SolicitudViewModel } from '../viewModels/SolicitudViewModel';

// Estos tipos reflejan exactamente los campos que expone el Backend en sus endpoints
export interface ISolicitudClient {
    crear(idUsuario: string, dto: object): Promise<SolicitudViewModel>;
    obtenerPorId(id: string): Promise<SolicitudViewModel | null>;
    listar(filtros: Record<string, string>, page?: number): Promise<SolicitudViewModel[]>;
    listarPorUsuario(idUsuario: string, page?: number): Promise<SolicitudViewModel[]>;
    modificar(id: string, dto: object): Promise<{ ok: boolean }>;
    cancelar(id: string): Promise<{ ok: boolean }>;
    aceptar(id: string, dto: object): Promise<{ ok: boolean }>;
    rechazar(id: string, dto?: object): Promise<{ ok: boolean }>;
}
