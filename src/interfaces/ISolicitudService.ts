import { SolicitudViewModel } from '../viewModels/SolicitudViewModel';
import { CrearSolicitudDTO, ModificarSolicitudDTO, AceptarSolicitudDTO, RechazarSolicitudDTO, FiltrosSolicitudDTO } from '../DTO/SolicitudDTO';

export interface ISolicitudService {
    crear(dto: CrearSolicitudDTO): Promise<SolicitudViewModel>;
    obtenerPorId(id: string): Promise<SolicitudViewModel | null>;
    listar(filtros: FiltrosSolicitudDTO, page?: number): Promise<SolicitudViewModel[]>;
    listarMias(page?: number): Promise<SolicitudViewModel[]>;
    modificar(id: string, dto: ModificarSolicitudDTO): Promise<{ ok: boolean }>;
    cancelar(id: string): Promise<{ ok: boolean }>;
    aceptar(id: string, dto: AceptarSolicitudDTO): Promise<{ ok: boolean }>;
    rechazar(id: string, dto?: RechazarSolicitudDTO): Promise<{ ok: boolean }>;
}
