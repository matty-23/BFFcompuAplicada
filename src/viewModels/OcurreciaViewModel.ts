import { UsuarioViewModel } from './UsuarioViewModel';

export class OcurrenciaViewModel {
    constructor(
        private readonly id: string,
        private readonly idEvento: string,
        private readonly fechaInicio: Date,
        private readonly fechaFinalizacion: Date,
        private readonly lugar: string,
        private readonly cantidadPersonas: number,
        private readonly participantes: UsuarioViewModel[] = [],
        private readonly encargado?: UsuarioViewModel
    ) {}

    getId(): string { return this.id; }
    // ... otros getters si son necesarios ...

    toJSON(): object {
        return {
            id: this.id,
            idEvento: this.idEvento,
            fechaInicio: this.fechaInicio,
            fechaFinalizacion: this.fechaFinalizacion,
            lugar: this.lugar,
            cantidadPersonas: this.cantidadPersonas,
            encargado: this.encargado?.toJSON(),
            participantes: this.participantes.map(p => p.toJSON()),
        };
    }
}