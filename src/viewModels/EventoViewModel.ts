import { OcurrenciaViewModel } from './OcurreciaViewModel';

export class EventoViewModel {
    constructor(
        private readonly id: string,
        private readonly titulo: string,
        private readonly estado: string,
        private readonly categoria: string,
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

    toJSON(): object {
        return {
            id: this.id,
            titulo: this.titulo,
            estado: this.estado,
            categoria: this.categoria,
            ocurrencias: this.ocurrencias.map(o => o.toJSON()),
        };
    }
}