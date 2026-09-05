import { Injectable, HttpException, HttpStatus, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { IEventoClient } from '../interfaces/IEventoClient';
import { EventoViewModel } from '../viewModels/EventoViewModel';
import { UsuarioViewModel } from '../viewModels/UsuarioViewModel';
import { OcurrenciaViewModel } from '../viewModels/OcurreciaViewModel';
import { ActualizarOcurrenciaDTO } from '../DTO/EventoDTO';
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';

@Injectable({ scope: Scope.REQUEST })
export class EventoClient implements IEventoClient {
    private readonly baseUrl = `${BACKEND_URL}/api/Eventos`;

    // Inyectamos el objeto Request de Express
    constructor(@Inject(REQUEST) private readonly request: Request) { }


    // En EventoClient.ts (Frontend/BFF)
    private mapearEvento(raw: any): EventoViewModel {
console.log('=== DATA CRUDA RECIBIDA DEL CORE ===');
        console.dir(raw, { depth: null, colors: true });
        // 👆 ========================================= 👆
        const ocurrencias = (raw.ocurrencias || []).map((oc: any) => {

            const encargado = oc.encargado
                ? new UsuarioViewModel(
                    oc.encargado.id,
                    oc.encargado.nombre,
                    oc.encargado.apellido,
                    oc.encargado.correo,
                    oc.encargado.departamento ?? '',
                    oc.encargado.rol ?? ''
                )
                : undefined;

            const participantes: UsuarioViewModel[] =
                (oc.participantes ?? []).map(
                    (p: any) =>
                        new UsuarioViewModel(
                            p.id,
                            p.nombre,
                            p.apellido,
                            p.correo,
                            p.departamento ?? '',
                            p.rol ?? ''
                        )
                );

            return new OcurrenciaViewModel(
                oc.id,
                oc.idEvento ?? raw.id,
                new Date(oc.fechaInicio),
                new Date(oc.fechaFinalizacion),
                oc.tipo ?? 'normal',
                oc.lugar,
                oc.cantidadPersonas ?? 0,
                participantes,
                encargado,
                oc.idApiGoogle ?? false, 
                (oc.ocurrenciaOriginal || oc.ocurrencia_original)? new Date(oc.ocurrenciaOriginal || oc.ocurrencia_original) : undefined,
                oc.fueActualizado ?? false,
                oc.id_api_google_instancia ?? undefined 
            );
        });

        return new EventoViewModel(
            raw.id,
            raw.titulo ?? raw.nombre ?? '',
            raw.estado ?? '',
            raw.categoria ?? '',
            raw.color ?? '#B2FFFF',
            raw.recurrencia ?? undefined,
            ocurrencias
        );
    }
    // Actualizar endpoints para coincidir con tu nuevo EventoController del Core

    private handleError(error: any, contexto: string): never {
        // Log agregado para tener visibilidad si el microservicio de Eventos rechaza la petición
        console.error(`❌ [EventoClient - ${contexto}] Error del backend de eventos:`, error);

        const status = error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const mensaje = error?.message ?? `Error al comunicarse con el backend (${contexto})`;
        throw new HttpException(mensaje, status);
    }

    private getHeaders(isJson: boolean = true): Record<string, string> {
        const headers: Record<string, string> = {};

        if (isJson) {
            headers['Content-Type'] = 'application/json';
        }

        // Si el frontend envió una cookie de sesión al BFF, la inyectamos en la llamada al backend final
        if (this.request.headers?.cookie) {
            headers['cookie'] = this.request.headers.cookie;
        }

        return headers;
    }

    // Métodos del cliente

    async getAll(page: number = 1): Promise<EventoViewModel[]> {
        try {
            const res = await fetch(`${this.baseUrl}/${page}/all`, {
                headers: this.getHeaders(false) // Agregamos los headers
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data: any[] = await res.json();
            return data.map(e => this.mapearEvento(e));
        } catch (e) { this.handleError(e, 'getAll'); }
    }

    async getById(id: string): Promise<EventoViewModel | null> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                headers: this.getHeaders(false) // Agregamos los headers
            });
            if (res.status === 404) return null;
            if (!res.ok) throw { status: res.status, message: await res.text() };
            const data = await res.json();
            return this.mapearEvento(data);
        } catch (e) { this.handleError(e, 'getById'); }
    }

    async crear(dto: object): Promise<EventoViewModel> {
        try {
            // 🔍 LOG: Ver qué objeto llega y cómo queda transformado a string en JSON.stringify
            const bodyJSON = JSON.stringify(dto);

            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: this.getHeaders(true), // Content-Type: json + Cookies
                body: bodyJSON,
            });

            if (!res.ok) throw { status: res.status, message: await res.text() };

            const data = await res.json();

            return this.mapearEvento(data);
        } catch (e) {
            console.error('[CLIENT API crear] Error en la petición HTTP:', e);
            this.handleError(e, 'crear');
        }
    }

    async actualizar(id: string, dto: object): Promise<void> {
        try {
            const res = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
        } catch (e) { this.handleError(e, 'actualizar'); }
    }

    async eliminar(ids: string[]): Promise<void> {
        try {
            const res = await fetch(this.baseUrl, { // baseUrl es http://localhost:3000/api/Eventos
                method: 'DELETE',
                headers: this.getHeaders(true), // Incluye Content-Type: application/json
                body: JSON.stringify(ids)
            });

            if (!res.ok) {
                throw { status: res.status, message: await res.text() };
            }
        } catch (e) {
            this.handleError(e, 'eliminar');
        }
    }

    async getConFiltros(filtros: any): Promise<EventoViewModel[]> {
        try {
            const params = new URLSearchParams();
            Object.entries(filtros).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '') return;

                if (Array.isArray(value)) {
                    value.forEach((item) => { params.append(key, String(item)); });
                } else {
                    params.append(key, String(value));
                }
            });

            const res = await fetch(`${this.baseUrl}/filtros?${params.toString()}`, { headers: this.getHeaders(false) });
            if (!res.ok) {
                throw {
                    status: res.status,
                    message: await res.text()
                };
            }

            const data: any[] = await res.json();

            return data.map(e => this.mapearEvento(e));

        } catch (e) {
            this.handleError(e, 'getConFiltros');
            return [];
        }
    }

    async actualizarOcurrencia(idEvento: string, idOcurrencia: string, dto: ActualizarOcurrenciaDTO): Promise<EventoViewModel> {
        try {
            const res = await fetch(`${this.baseUrl}/${idEvento}/ocurrencias/${idOcurrencia}`,
                {
                    method: 'PATCH',
                    headers: this.getHeaders(true),
                    body: JSON.stringify(dto),
                }
            );
            if (!res.ok) {
                throw { status: res.status, message: await res.text() };
            }

            return this.mapearEvento(await res.json());

        } catch (e) { this.handleError(e, 'actualizarOcurrencia'); }
    }
    async agregarParticipantes(idOcurrencia: string, participantes: string[]): Promise<void> {
        try {
            const res = await fetch(`${this.baseUrl}/ocurrencias/${idOcurrencia}/AParticipantes`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
                body: JSON.stringify(participantes),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
        } catch (e) { this.handleError(e, 'agregarParticipantes'); }
    }

    async borrarParticipante(idOcurrencia: string, usuarioId: string): Promise<EventoViewModel> {
        try {
            const res = await fetch(`${this.baseUrl}/ocurrencias/${idOcurrencia}/BParticipantes`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
                body: JSON.stringify({ usuarioId }),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearEvento(await res.json());
        } catch (e) { this.handleError(e, 'borrarParticipante'); }
    }
    // Reemplazá el viejo método 'crear' por estos dos:
    async crearMono(dto: object): Promise<EventoViewModel> {
        try {
            const res = await fetch(`${this.baseUrl}/mono`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearEvento(await res.json());
        } catch (e) { this.handleError(e, 'crearMono'); }
    }

    async crearMulti(dto: object): Promise<EventoViewModel> {
        try {
            const res = await fetch(`${this.baseUrl}/multi`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw { status: res.status, message: await res.text() };
            return this.mapearEvento(await res.json());
        } catch (e) { this.handleError(e, 'crearMulti'); }
    }
}