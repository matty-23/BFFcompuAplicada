import { EventoViewModel } from '../viewModels/EventoViewModel';
import { CrearEventoDTO, ActualizarEventoDTO } from '../DTO/EventoDTO';


export interface IEventoService {
    getEventos(): Promise<EventoViewModel[]>;
    getEventoById(id: string): Promise<EventoViewModel | null>;
    crearEvento(dto: CrearEventoDTO): Promise<EventoViewModel>;
    actualizarEvento(id: string, dto: ActualizarEventoDTO): Promise<void>;
    eliminarEvento(id: string): Promise<void>;
    asignarEncargado(id: string, usuarioId: string): Promise<EventoViewModel>;
    agregarParticipantes(id: string, participantes: string[]): Promise<void>;
    borrarParticipante(id: string, usuarioId: string): Promise<EventoViewModel>;
    getEventosPorUsuario(usuarioId: string): Promise<EventoViewModel[]>;
}
