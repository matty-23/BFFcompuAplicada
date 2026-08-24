import { SolicitudViewModel } from '../viewModels/SolicitudViewModel';

export interface ISolicitudService {
    crear(idUsuario: string, dto: object): Promise<SolicitudViewModel>;
    obtenerPorId(id: string): Promise<SolicitudViewModel | null>;
    listar(filtros: Record<string, string>, page?: number): Promise<SolicitudViewModel[]>;
    listarMias(idUsuario: string, page?: number): Promise<SolicitudViewModel[]>;
    modificar(id: string, dto: object): Promise<{ ok: boolean }>;
    cancelar(id: string): Promise<{ ok: boolean }>;
    aceptar(id: string, dto: object): Promise<{ ok: boolean }>;
    rechazar(id: string, dto?: object): Promise<{ ok: boolean }>;
}
