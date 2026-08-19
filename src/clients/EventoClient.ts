import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IEventoClient } from '../interfaces/IEventoClient';
import { EventoViewModel } from '../viewModels/EventoViewModel';
import { UsuarioViewModel } from '../viewModels/UsuarioViewModel';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';

/**
 * Cliente HTTP que se comunica con el Backend REST.
 * Es el único lugar del BFF donde vive la URL del backend.
 */
@Injectable()
export class EventoClient implements IEventoClient {

    private readonly baseUrl = `${BACKEND_URL}/api/Eventos`;

    // mapeador
    private mapearEvento(raw: any): EventoViewModel {
        const encargado = raw.encargado
            ? new UsuarioViewModel(
                raw.encargado.id,
                raw.encargado.nombre,
                raw.encargado.apellido,
                raw.encargado.correo,
                raw.encargado.departamento ?? '',
                raw.encargado.rol ?? ''
            )
            : undefined;

        const participantes: UsuarioViewModel[] = (raw.participantes ?? []).map(
            (p: any) => new UsuarioViewModel(p.id, p.nombre, p.apellido, p.correo, p.departamento ?? '', p.rol ?? '')
        );

        return new EventoViewModel(
            raw.id,
            raw.nombre,
            new Date(raw.fechaInicio),
            new Date(raw.fechaFinalizacion),
            raw.lugar,
            raw.categoria ?? '',
            raw.cantidadPersonas,
            raw.estado ?? '',
            participantes,
            encargado
        );
    }

    // Manejo de errores HTTP del backend
    private handleError(error: any, contexto: string): never {
        const status = error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const mensaje = error?.message ?? `Error al comunicarse con el backend (${contexto})`;
        throw new HttpException(mensaje, status);
    }

    // Métodos
    async getAll(): Promise<EventoViewModel[]> {
        try {
            const res = await fetch(this.baseUrl);
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data: any[] = await res.json();
            return data.map(e => this.mapearEvento(e));
        } catch (e) { this.handleError(e, 'getAll'); }
    }

    async getById(id: string): Promise<EventoViewModel | null> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`);
            if (res.status === 404) return null;
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data = await res.json();
            return this.mapearEvento(data);
        } catch (e) { this.handleError(e, 'getById'); }
    }

    async crear(dto: object): Promise<EventoViewModel> {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearEvento(await res.json());
        } catch (e) { this.handleError(e, 'crear'); }
    }

    async actualizar(id: string, dto: object): Promise<void> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
        } catch (e) { this.handleError(e, 'actualizar'); }
    }

    async eliminar(id: string): Promise<void> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw { status: res.status, message: await res.text() };
        } catch (e) { this.handleError(e, 'eliminar'); }
    }

    async asignarEncargado(id: string, usuarioId: string): Promise<EventoViewModel> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}/encargado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuarioId }),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearEvento(await res.json());
        } catch (e) { this.handleError(e, 'asignarEncargado'); }
    }

    async agregarParticipantes(id: string, participantes: string[]): Promise<void> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}/AParticipantes`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(participantes),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
        } catch (e) { this.handleError(e, 'agregarParticipantes'); }
    }

    async borrarParticipante(id: string, usuarioId: string): Promise<EventoViewModel> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}/BParticipantes`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuarioId }),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearEvento(await res.json());
        } catch (e) { this.handleError(e, 'borrarParticipante'); }
    }

    // Mejora 3: obtener todos los eventos en los que participa un usuario
    async getEventosPorUsuario(usuarioId: string): Promise<EventoViewModel[]> {
        try {
            const res = await fetch(`${this.baseUrl}/usuario/${usuarioId}`);
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data: any[] = await res.json();
            return data.map(e => this.mapearEvento(e));
        } catch (e) { this.handleError(e, 'getEventosPorUsuario'); }
    }
}
