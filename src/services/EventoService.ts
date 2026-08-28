import { Injectable, Inject } from '@nestjs/common';
import type { IEventoService } from '../interfaces/IEventoService';
import type { IEventoClient } from '../interfaces/IEventoClient';
import { EventoViewModel } from '../viewModels/EventoViewModel';
import { CrearEventoMultiDTO, ActualizarEventoDTO } from '../DTO/EventoDTO';
import { filtrosEventoDto } from '../DTO/FiltrosDto';

@Injectable()
export class EventoService implements IEventoService {

    constructor(
        @Inject('IEventoClient') private readonly eventoClient: IEventoClient
    ) { }

    async getEventos(): Promise<EventoViewModel[]> {
        return await this.eventoClient.getAll();
    }
    async filtrado(filtros: filtrosEventoDto): Promise<EventoViewModel[]> {
        // Por defecto, si no mandan página, le asignamos la página 1
        if (!filtros.page) {
            filtros.page = 1;
        }

        return await this.eventoClient.getConFiltros(filtros);
    }
    async getEventoById(id: string): Promise<EventoViewModel | null> {
        return await this.eventoClient.getById(id);
    }
async crearEventoMulti(dto: CrearEventoMultiDTO): Promise<EventoViewModel> {
    return await this.eventoClient.crearMulti(dto);
}
    async actualizarEvento(id: string, dto: ActualizarEventoDTO): Promise<void> {
        const payload: Record<string, unknown> = {};

        if (dto.titulo !== undefined) payload['titulo'] = dto.titulo;
        if (dto.categoria !== undefined) payload['categoria'] = dto.categoria;
        if (dto.estado !== undefined) payload['estado'] = dto.estado;

        // 👈 AÑADE ESTA LÍNEA PARA ENVIAR LAS OCURRENCIAS AL CORE
        if (dto.ocurrencias !== undefined) payload['ocurrencias'] = dto.ocurrencias;

        await this.eventoClient.actualizar(id, payload);
    }

    async eliminarEvento(id: string[]): Promise<void> {
        await this.eventoClient.eliminar(id);
    }

    async asignarEncargado(idEvento: string, idOcurrencia: string, usuarioId: string): Promise<EventoViewModel> {
        return await this.eventoClient.asignarEncargado(idEvento, idOcurrencia, usuarioId);
    }

    async agregarParticipantes(idOcurrencia: string, participantes: string[]): Promise<void> {
        await this.eventoClient.agregarParticipantes(idOcurrencia, participantes);
    }

    async borrarParticipante(idOcurrencia: string, usuarioId: string): Promise<EventoViewModel> {
        return await this.eventoClient.borrarParticipante(idOcurrencia, usuarioId);
    }
}
