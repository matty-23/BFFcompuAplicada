export class Usuario {
  constructor(
    private id: string,
    private nombre: string,
    private apellido: string,
    private correo: string,
    private departamento: string,
    private rol: string,
    private contraseña?: string
  ) {}

  // Getters y Setters
  get _id(): string {
    return this.id;
  }
  set _id(value: string) {
    this.id = value;
  }

  get _nombre(): string {
    return this.nombre;
  }
  set _nombre(value: string) {
    this.nombre = value;
  }

  get _apellido(): string {
    return this.apellido;
  }
  set _apellido(value: string) {
    this.apellido = value;
  }

  get _correo(): string {
    return this.correo;
  }
  set _correo(value: string) {
    this.correo = value;
  }

  get _departamento(): string {
    return this.departamento;
  }
  set _departamento(value: string) {
    this.departamento = value;
  }

  get _rol(): string {
    return this.rol;
  }
  set _rol(value: string) {
    this.rol = value;
  }

  get _contraseña(): string | undefined {
    return this.contraseña;
  }
  set _contraseña(value: string | undefined) {
    this.contraseña = value;
  }

  // Métodos de dominio / helpers
  getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  /**
   * Retorna una representación sin datos sensibles (sin contraseña)
   * para devolver en respuestas de la API.
   */
  toResponseObject() {
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