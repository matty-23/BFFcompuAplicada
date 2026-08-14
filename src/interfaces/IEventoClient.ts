import { EventoViewModel } from '../viewModels/EventoViewModel';

export interface IEventoClient {
    getAll(): Promise<EventoViewModel[]>;
    getById(id: string): Promise<EventoViewModel | null>;
    crear(dto: object): Promise<EventoViewModel>;
    actualizar(id: string, dto: object): Promise<void>;
    eliminar(id: string[]): Promise<void>;
    asignarEncargado(id: string, usuarioId: string): Promise<EventoViewModel>;
    agregarParticipantes(id: string, participantes: string[]): Promise<void>;
    borrarParticipante(id: string, usuarioId: string): Promise<EventoViewModel>;
    getConFiltros(filtros: any): Promise<EventoViewModel[]>;
}
