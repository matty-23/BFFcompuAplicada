import { Injectable, Inject } from '@nestjs/common';
import type { ISolicitudService } from '../interfaces/ISolicitudService';
import type { ISolicitudClient } from '../interfaces/ISolicitudClient';
import { SolicitudViewModel } from '../viewModels/SolicitudViewModel';
import { CrearSolicitudDTO, ModificarSolicitudDTO, AceptarSolicitudDTO, RechazarSolicitudDTO, FiltrosSolicitudDTO } from '../DTO/SolicitudDTO';

@Injectable()
export class SolicitudService implements ISolicitudService {
    constructor(
        // TODO (Eve): El SolicitudClient lo implementa Eve. Cuando ella lo haga,
        //             este token 'ISolicitudClient' va a estar disponible via DI.
        @Inject('ISolicitudClient') private readonly solicitudClient: ISolicitudClient
    ) {}

    async crear(dto: CrearSolicitudDTO): Promise<SolicitudViewModel> {
        return await this.solicitudClient.crear(dto);
    }

    async obtenerPorId(id: string): Promise<SolicitudViewModel | null> {
        return await this.solicitudClient.obtenerPorId(id);
    }

    async listar(filtros: FiltrosSolicitudDTO, page?: number): Promise<SolicitudViewModel[]> {
        return await this.solicitudClient.listar(filtros, page);
    }

    async listarMias(page?: number): Promise<SolicitudViewModel[]> {
        return await this.solicitudClient.listarPorUsuario(page);
    }

    async modificar(id: string, dto: ModificarSolicitudDTO): Promise<{ ok: boolean }> {
        return await this.solicitudClient.modificar(id, dto);
    }

    async cancelar(id: string): Promise<{ ok: boolean }> {
        return await this.solicitudClient.cancelar(id);
    }

    async aceptar(id: string, dto: AceptarSolicitudDTO): Promise<{ ok: boolean }> {
        return await this.solicitudClient.aceptar(id, dto);
    }

    async rechazar(id: string, dto?: RechazarSolicitudDTO): Promise<{ ok: boolean }> {
        return await this.solicitudClient.rechazar(id, dto);
    }
}
