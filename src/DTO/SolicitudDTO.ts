export interface BloqueSolicitudDTO {
    fechaInicio: string;
    fechaFinalizacion: string;
    lugar: string;
}

export interface CrearSolicitudDTO {
    tipoEvento: string;
    cantidadPersonas: number;
    necesidadOperario: boolean;
    autorizacionRectoria: boolean;
    bloques: BloqueSolicitudDTO[];
    personaEncargada?: string;
}

export interface ModificarSolicitudDTO {
    tipoEvento?: string;
    cantidadPersonas?: number;
    necesidadOperario?: boolean;
    autorizacionRectoria?: boolean;
    personaEncargada?: string;
    bloques?: BloqueSolicitudDTO[];
}

export interface AceptarSolicitudDTO {
    tiempoAnticipacion: number;
    cantidadOperariosDesignados?: number;
}

export interface RechazarSolicitudDTO {
    motivo?: string;
}

export interface FiltrosSolicitudDTO {
    estado?: string;
    idUsuario?: string;
    fechaDesde?: string;
    fechaHasta?: string;
}