export class UsuarioViewModel {
    private readonly id: string;
    private readonly nombre: string;
    private readonly apellido: string;
    private readonly correo: string;
    private readonly departamento: string;
    private readonly rol: string;

    constructor(
        id: string,
        nombre: string,
        apellido: string,
        correo: string,
        departamento: string,
        rol: string
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.departamento = departamento;
        this.rol = rol;
    }

    getId(): string { return this.id; }
    getNombre(): string { return this.nombre; }
    getApellido(): string { return this.apellido; }
    getCorreo(): string { return this.correo; }
    getDepartamento(): string { return this.departamento; }
    getRol(): string { return this.rol; }

    /**
     * Nombre completo para mostrar en el front.
     */
    getNombreCompleto(): string {
        return `${this.nombre} ${this.apellido}`;
    }

    /**
     * ViewModel a objeto para la respuesta en JSON.
     */
    toJSON(): object {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            correo: this.correo,
            departamento: this.departamento,
            rol: this.rol,
        };
    }
}
