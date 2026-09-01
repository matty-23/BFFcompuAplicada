import { OcurrenciaViewModel } from './OcurreciaViewModel';

export class EventoViewModel {
    constructor(
        private readonly id: string,
        private readonly titulo: string,
        private readonly estado: string,
        private readonly categoria: string,
        private readonly color: string = "#B2FFFF",
        private readonly recurrencia?: string,
        private readonly ocurrencias: OcurrenciaViewModel[] = []
    ) {}

    getId(): string {
        return this.id;
    }

    getTitulo(): string {
        return this.titulo;
    }

    getEstado(): string {
        return this.estado;
    }

    getCategoria(): string {
        return this.categoria;
    }

    getColor(): string {
        return this.color;
    }

    getRecurrencia(): string | undefined {
        return this.recurrencia;
    }

    getOcurrencias(): OcurrenciaViewModel[] {
        return this.ocurrencias;
    }

    toJSON(): object {
        return {
            id: this.id,
            titulo: this.titulo,
            estado: this.estado,
            categoria: this.categoria,
            color: this.color,
            recurrencia: this.recurrencia,
            ocurrencias: this.ocurrencias.map(o => o.toJSON()),
        };
    }
}