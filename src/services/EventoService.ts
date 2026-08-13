import { Injectable, Inject } from '@nestjs/common';
import type { IEventoService } from '../interfaces/IEventoService';
import type { IEventoClient } from '../interfaces/IEventoClient';
import { EventoViewModel } from '../viewModels/EventoViewModel';
import { CrearEventoDTO, ActualizarEventoDTO } from '../DTO/EventoDTO';


@Injectable()
export class EventoService implements IEventoService {

    constructor(
        @Inject('IEventoClient') private readonly eventoClient: IEventoClient
    ) { }

    async getEventos(): Promise<EventoViewModel[]> {
        return await this.eventoClient.getAll();
    }

    async getEventoById(id: string): Promise<EventoViewModel | null> {
        return await this.eventoClient.getById(id);
    }

    async crearEvento(dto: CrearEventoDTO): Promise<EventoViewModel> {
        // Se cambia el DTO del BFF al formato que espera el backend
        const payload = {
            nombre: dto.nombre,
            fechaInicio: dto.fechaInicio,
            fechaFinalizacion: dto.fechaFinalizacion,
            lugar: dto.lugar,
            categoria: dto.categoria,
            cantidadPersonas: dto.cantidadPersonas,
        };
        return await this.eventoClient.crear(payload);
    }

    async actualizarEvento(id: string, dto: ActualizarEventoDTO): Promise<void> {
        const payload: Record<string, unknown> = {};
        if (dto.nombre !== undefined) payload['nombre'] = dto.nombre;
        if (dto.fechaInicio !== undefined) payload['fechaInicio'] = dto.fechaInicio;
        if (dto.fechaFinalizacion !== undefined) payload['fechaFinalizacion'] = dto.fechaFinalizacion;
        if (dto.lugar !== undefined) payload['lugar'] = dto.lugar;
        if (dto.categoria !== undefined) payload['categoria'] = dto.categoria;
        if (dto.cantidadPersonas !== undefined) payload['cantidadPersonas'] = dto.cantidadPersonas;
        await this.eventoClient.actualizar(id, payload);
    }

    async eliminarEvento(id: string): Promise<void> {
        await this.eventoClient.eliminar(id);
    }

    async asignarEncargado(id: string, usuarioId: string): Promise<EventoViewModel> {
        return await this.eventoClient.asignarEncargado(id, usuarioId);
    }

    async agregarParticipantes(id: string, participantes: string[]): Promise<void> {
        await this.eventoClient.agregarParticipantes(id, participantes);
    }

    async borrarParticipante(id: string, usuarioId: string): Promise<EventoViewModel> {
        return await this.eventoClient.borrarParticipante(id, usuarioId);
    }
}
