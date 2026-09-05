import { Injectable, HttpException, HttpStatus, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { ISolicitudClient } from '../interfaces/ISolicitudClient';
import { SolicitudViewModel, BloqueSolicitudViewModel } from '../viewModels/SolicitudViewModel';
import { CrearSolicitudDTO, ModificarSolicitudDTO, AceptarSolicitudDTO, RechazarSolicitudDTO, FiltrosSolicitudDTO } from '../DTO/SolicitudDTO';
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';
@Injectable({ scope: Scope.REQUEST })
export class SolicitudClient implements ISolicitudClient {
    private readonly baseUrl = `${BACKEND_URL}/api/solicitudes`;

    constructor(@Inject(REQUEST) private readonly request: Request) {}

    private mapearSolicitud(raw: any): SolicitudViewModel {
        const bloques: BloqueSolicitudViewModel[] = (raw.bloques || []).map(
            (b: any) => new BloqueSolicitudViewModel(
                b.id,
                new Date(b.fechaInicio),
                new Date(b.fechaFinalizacion),
                b.lugar,
            ),
        );

        return new SolicitudViewModel(
            raw.id,
            raw.idUsuarioSolicitante,
            raw.tipoEvento,
            raw.estado,
            raw.necesidadOperario,
            raw.autorizacionRectoria,
            bloques,
            raw.cantidadPersonas,
            raw.personaEncargada,
            raw.tiempoAnticipacion,
            raw.cantidadOperariosDesignados,
        );
    }

    private handleError(error: any, contexto: string): never {
        console.error(`❌ [SolicitudClient - ${contexto}] Error del backend de solicitudes:`, error);
        const status = error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const mensaje = error?.message ?? `Error al comunicarse con el backend (${contexto})`;
        throw new HttpException(mensaje, status);
    }

    private getHeaders(isJson: boolean = true): Record<string, string> {
        const headers: Record<string, string> = {};
        if (isJson) headers['Content-Type'] = 'application/json';
        if (this.request.headers?.cookie) headers['cookie'] = this.request.headers.cookie;
        return headers;
    }

    async crear(dto: CrearSolicitudDTO): Promise<SolicitudViewModel> {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearSolicitud(await res.json());
        } catch (e) { this.handleError(e, 'crear'); }
    }

    async obtenerPorId(id: string): Promise<SolicitudViewModel | null> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                headers: this.getHeaders(false),
            });
            if (res.status === 404) return null;
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearSolicitud(await res.json());
        } catch (e) { this.handleError(e, 'obtenerPorId'); }
    }

    async listar(filtros: FiltrosSolicitudDTO, page: number = 1): Promise<SolicitudViewModel[]> {
        try {
            const queryParams = new URLSearchParams({ ...filtros, page: String(page) }).toString();
            const res = await fetch(`${this.baseUrl}?${queryParams}`, {
                headers: this.getHeaders(false),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data: any[] = await res.json();
            return data.map(s => this.mapearSolicitud(s));
        } catch (e) { this.handleError(e, 'listar'); }
    }

    async listarPorUsuario(page: number = 1): Promise<SolicitudViewModel[]> {
        try {
            const res = await fetch(`${this.baseUrl}/mis?page=${page}`, {
                headers: this.getHeaders(false),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data: any[] = await res.json();
            return data.map(s => this.mapearSolicitud(s));
        } catch (e) { this.handleError(e, 'listarPorUsuario'); }
    }

    async modificar(id: string, dto: ModificarSolicitudDTO): Promise<{ ok: boolean }> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data = await res.json();
            return { ok: Boolean(data.ok) };
        } catch (e) { this.handleError(e, 'modificar'); }
    }

    async cancelar(id: string): Promise<{ ok: boolean }> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(false),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data = await res.json();
            return { ok: Boolean(data.ok) };
        } catch (e) { this.handleError(e, 'cancelar'); }
    }

    async aceptar(id: string, dto: AceptarSolicitudDTO): Promise<{ ok: boolean }> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}/aceptar`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data = await res.json();
            return { ok: Boolean(data.ok) };
        } catch (e) { this.handleError(e, 'aceptar'); }
    }

    async rechazar(id: string, dto?: RechazarSolicitudDTO): Promise<{ ok: boolean }> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}/rechazar`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
                body: JSON.stringify(dto ?? {}),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data = await res.json();
            return { ok: Boolean(data.ok) };
        } catch (e) { this.handleError(e, 'rechazar'); }
    }
}
