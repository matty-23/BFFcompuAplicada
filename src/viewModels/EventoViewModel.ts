import { UsuarioViewModel } from './UsuarioViewModel';

/**
 * ViewModel de Evento
 */
export class EventoViewModel {
    private readonly id: string;
    private readonly nombre: string;
    private readonly fechaInicio: Date;
    private readonly fechaFinalizacion: Date;
    private readonly lugar: string;
    private readonly categoria: string;
    private readonly cantidadPersonas: number;
    private readonly estado: string;
    private readonly encargado?: UsuarioViewModel;
    private readonly participantes: UsuarioViewModel[];

    constructor(
        id: string,
        nombre: string,
        fechaInicio: Date,
        fechaFinalizacion: Date,
        lugar: string,
        categoria: string,
        cantidadPersonas: number,
        estado: string,
        participantes: UsuarioViewModel[] = [],
        encargado?: UsuarioViewModel
    ) {
        this.id = id;
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFinalizacion = fechaFinalizacion;
        this.lugar = lugar;
        this.categoria = categoria;
        this.cantidadPersonas = cantidadPersonas;
        this.estado = estado;
        this.participantes = participantes;
        this.encargado = encargado;
    }

    getId(): string { return this.id; }
    getNombre(): string { return this.nombre; }
    getFechaInicio(): Date { return this.fechaInicio; }
    getFechaFinalizacion(): Date { return this.fechaFinalizacion; }
    getLugar(): string { return this.lugar; }
    getCategoria(): string { return this.categoria; }
    getCantidadPersonas(): number { return this.cantidadPersonas; }
    getEstado(): string { return this.estado; }
    getEncargado(): UsuarioViewModel | undefined { return this.encargado; }
    getParticipantes(): UsuarioViewModel[] { return this.participantes; }

    /**
     * ViewModel a un objeto  para la en respuesta JSON.
     */
    toJSON(): object {
        return {
            id: this.id,
            nombre: this.nombre,
            fechaInicio: this.fechaInicio,
            fechaFinalizacion: this.fechaFinalizacion,
            lugar: this.lugar,
            categoria: this.categoria,
            cantidadPersonas: this.cantidadPersonas,
            estado: this.estado,
            encargado: this.encargado?.toJSON(),
            participantes: this.participantes.map(p => p.toJSON()),
        };
    }
}
