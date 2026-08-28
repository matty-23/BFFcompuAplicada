import { SolicitudViewModel } from '../viewModels/SolicitudViewModel';
import { CrearSolicitudDTO, ModificarSolicitudDTO, AceptarSolicitudDTO, RechazarSolicitudDTO, FiltrosSolicitudDTO } from '../DTO/SolicitudDTO';

// Estos tipos reflejan exactamente los campos que expone el Backend en sus endpoints
export interface ISolicitudClient {
    crear(dto: CrearSolicitudDTO): Promise<SolicitudViewModel>;
    obtenerPorId(id: string): Promise<SolicitudViewModel | null>;
    listar(filtros: FiltrosSolicitudDTO, page?: number): Promise<SolicitudViewModel[]>;
    listarPorUsuario(page?: number): Promise<SolicitudViewModel[]>;
    modificar(id: string, dto: ModificarSolicitudDTO): Promise<{ ok: boolean }>;
    cancelar(id: string): Promise<{ ok: boolean }>;
    aceptar(id: string, dto: AceptarSolicitudDTO): Promise<{ ok: boolean }>;
    rechazar(id: string, dto?: RechazarSolicitudDTO): Promise<{ ok: boolean }>;
}
