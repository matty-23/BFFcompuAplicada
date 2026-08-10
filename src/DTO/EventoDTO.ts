import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString, Min } from 'class-validator';

export class CrearEventoDTO {
    @IsString()
    @IsNotEmpty()
    readonly nombre!: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fechaInicio!: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fechaFinalizacion!: string;

    @IsString()
    @IsNotEmpty()
    readonly lugar!: string;

    @IsString()
    @IsOptional()
    readonly categoria?: string;

    @IsInt()
    @Min(1)
    readonly cantidadPersonas!: number;
}

/**
 * DTO para actualizar los datos principales de un evento.
 * Todos los campos son opcionales (PATCH).
 */
export class ActualizarEventoDTO {
    @IsString()
    @IsOptional()
    readonly nombre?: string;

    @IsDateString()
    @IsOptional()
    readonly fechaInicio?: string;

    @IsDateString()
    @IsOptional()
    readonly fechaFinalizacion?: string;

    @IsString()
    @IsOptional()
    readonly lugar?: string;

    @IsString()
    @IsOptional()
    readonly categoria?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    readonly cantidadPersonas?: number;
}

/**
 * Asignar o cambiar el encargado de un evento.
 */
export class AsignarEncargadoDTO {
    @IsString()
    @IsNotEmpty()
    readonly usuarioId!: string;
}

/**
 * Agregar o quitar participantes de un evento.
 * Recibe un array de IDs de usuario.
 */
export class ParticipantesDTO {
    readonly participantes!: string[];
}
