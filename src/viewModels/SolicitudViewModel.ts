export class BloqueSolicitudViewModel {
    constructor(
        private readonly id: string,
        private readonly fechaInicio: Date,
        private readonly fechaFinalizacion: Date,
        private readonly lugar: string
    ) {}

    getId(): string { return this.id; }
    getFechaInicio(): Date { return this.fechaInicio; }
    getFechaFinalizacion(): Date { return this.fechaFinalizacion; }
    getLugar(): string { return this.lugar; }

    toJSON(): object {
        return {
            id: this.id,
            fechaInicio: this.fechaInicio,
            fechaFinalizacion: this.fechaFinalizacion,
            lugar: this.lugar,
        };
    }
}

export class SolicitudViewModel {
    constructor(
        private readonly id: string,
        private readonly idUsuarioSolicitante: string,
        private readonly tipoEvento: string,
        private readonly estado: string,
        private readonly necesidadOperario: boolean,
        private readonly autorizacionRectoria: boolean,
        private readonly bloques: BloqueSolicitudViewModel[],
        private readonly cantidadPersonas?: number,
        private readonly personaEncargada?: string,
        private readonly tiempoAnticipacion?: number,
        private readonly cantidadOperariosDesignados?: number,
    ) {}

    getId(): string { return this.id; }
    getIdUsuarioSolicitante(): string { return this.idUsuarioSolicitante; }
    getEstado(): string { return this.estado; }
    getTipoEvento(): string { return this.tipoEvento; }
    getNecesidadOperario(): boolean { return this.necesidadOperario; }
    getAutorizacionRectoria(): boolean { return this.autorizacionRectoria; }
    getBloques(): BloqueSolicitudViewModel[] { return this.bloques; }
    getCantidadPersonas(): number | undefined { return this.cantidadPersonas; }
    getPersonaEncargada(): string | undefined { return this.personaEncargada; }
    getTiempoAnticipacion(): number | undefined { return this.tiempoAnticipacion; }
    getCantidadOperariosDesignados(): number | undefined { return this.cantidadOperariosDesignados; }

    toJSON(): object {
        return {
            id: this.id,
            idUsuarioSolicitante: this.idUsuarioSolicitante,
            tipoEvento: this.tipoEvento,
            estado: this.estado,
            necesidadOperario: this.necesidadOperario,
            autorizacionRectoria: this.autorizacionRectoria,
            cantidadPersonas: this.cantidadPersonas,
            personaEncargada: this.personaEncargada,
            tiempoAnticipacion: this.tiempoAnticipacion,
            cantidadOperariosDesignados: this.cantidadOperariosDesignados,
            bloques: this.bloques.map(b => b.toJSON()),
        };
    }
}