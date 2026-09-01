import { EventoViewModel } from '../viewModels/EventoViewModel';
import { ActualizarOcurrenciaDTO } from '../DTO/EventoDTO';
export interface IEventoClient {
    getAll(): Promise<EventoViewModel[]>;
    getById(id: string): Promise<EventoViewModel | null>;
    crearMono(dto: object): Promise<EventoViewModel>
    crearMulti(dto: object): Promise<EventoViewModel>
    actualizar(id: string, dto: object): Promise<void>;
    eliminar(id: string[]): Promise<void>;
    actualizarOcurrencia(idEvento: string, idOcurrencia: string, dto: ActualizarOcurrenciaDTO): Promise<EventoViewModel>;
    agregarParticipantes(id: string, participantes: string[]): Promise<void>;
    borrarParticipante(id: string, usuarioId: string): Promise<EventoViewModel>;
    getConFiltros(filtros: any): Promise<EventoViewModel[]>;
}
