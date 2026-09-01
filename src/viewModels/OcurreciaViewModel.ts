import { UsuarioViewModel } from './UsuarioViewModel';

export class OcurrenciaViewModel {
    constructor(
        private readonly id: string,
        private readonly idEvento: string,
        private readonly fechaInicio: Date,
        private readonly fechaFinalizacion: Date,
        private readonly tipo: string = "normal",
        private readonly lugar?: string,
        private readonly cantidadPersonas: number = 0,
        private readonly participantes: UsuarioViewModel[] = [],
        private readonly encargado?: UsuarioViewModel,
        private readonly idApiGoogle: boolean = false,
        private readonly fueActualizado: boolean = false,
    ) {}

    getId(): string {
        return this.id;
    }

    getIdEvento(): string {
        return this.idEvento;
    }

    getFechaInicio(): Date {
        return this.fechaInicio;
    }

    getFechaFinalizacion(): Date {
        return this.fechaFinalizacion;
    }

    getTipo(): string {
        return this.tipo;
    }

    getLugar(): string | undefined {
        return this.lugar;
    }

    getCantidadPersonas(): number {
        return this.cantidadPersonas;
    }

    getParticipantes(): UsuarioViewModel[] {
        return this.participantes;
    }

    getEncargado(): UsuarioViewModel | undefined {
        return this.encargado;
    }

    getIdApiGoogle(): boolean {
        return this.idApiGoogle;
    }

    getFueActualizado(): boolean {
        return this.fueActualizado;
    }

    toJSON(): object {
        return {
            id: this.id,
            idEvento: this.idEvento,
            fechaInicio: this.fechaInicio,
            fechaFinalizacion: this.fechaFinalizacion,
            tipo: this.tipo,
            lugar: this.lugar,
            cantidadPersonas: this.cantidadPersonas,
            encargado: this.encargado?.toJSON(),
            participantes: this.participantes.map(p => p.toJSON()),
            idApiGoogle: this.idApiGoogle,
            fueActualizado: this.fueActualizado,
        };
    }
}