export class BloqueSolicitudViewModel {
    constructor(
        private readonly id: string,
        private readonly fechaInicio: Date,
        private readonly fechaFinalizacion: Date,
        private readonly lugar: string
    ) {}

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
    getEstado(): string { return this.estado; }
    getTipoEvento(): string { return this.tipoEvento; }

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
