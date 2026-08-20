import { EventoViewModel } from '../viewModels/EventoViewModel';
import { CrearEventoMultiDTO, ActualizarEventoDTO } from '../DTO/EventoDTO';
import { filtrosEventoDto } from '../DTO/FiltrosDto';

export interface IEventoService {
    getEventos(): Promise<EventoViewModel[]>;
    getEventoById(id: string): Promise<EventoViewModel | null>;
    crearEventoMulti(dto: CrearEventoMultiDTO): Promise<EventoViewModel>;
    actualizarEvento(id: string, dto: ActualizarEventoDTO): Promise<void>;
    eliminarEvento(id: string[]): Promise<void>;
    asignarEncargado(idEvento: string, idOcurrencia: string, usuarioId: string): Promise<EventoViewModel>;
    agregarParticipantes(idOcurrencia: string, participantes: string[]): Promise<void>;
    borrarParticipante(idOcurrencia: string, usuarioId: string): Promise<EventoViewModel>;
    filtrado(filtros: filtrosEventoDto): Promise<EventoViewModel[]>;
}
