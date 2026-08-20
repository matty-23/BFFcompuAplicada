import { IsString, IsNumber, IsNotEmpty, IsArray, ValidateNested, IsInt, IsOptional, ArrayMinSize, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OcurrenciaDTO {
    @IsString()
    @IsNotEmpty()
    lugar!: string;

    @IsString()
    @IsNotEmpty()
    fechaInicio!: string;

    @IsString()
    @IsNotEmpty()
    fechaFinalizacion!: string;

    @IsNumber()
    cantidadPersonas!: number;
}


export class CrearEventoMultiDTO {
    @IsString()
    @IsNotEmpty()
    readonly titulo!: string;

    @IsString()
    @IsOptional()
    readonly categoria?: string;

    @IsArray()
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => OcurrenciaDTO)
    readonly ocurrencias!: OcurrenciaDTO[];
}

export class ActualizarOcurrenciaDTO {
    @IsString()
    @IsNotEmpty()
    readonly id!: string;

    @IsString()
    @IsOptional()
    readonly lugar?: string;

    @IsString()
    @IsOptional()
    readonly fechaInicio?: string;

    @IsString()
    @IsOptional()
    readonly fechaFinalizacion?: string;

    @IsNumber()
    @IsOptional()
    readonly cantidadPersonas?: number;
}

// Y modifica tu clase ActualizarEventoDTO existente así:
export class ActualizarEventoDTO {
    @IsString()
    @IsOptional()
    readonly titulo?: string;

    @IsString()
    @IsOptional()
    readonly categoria?: string;

    @IsString()
    @IsOptional()
    readonly estado?: string;

    // 👈 NUEVO CAMPO AÑADIDO
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ActualizarOcurrenciaDTO)
    @IsOptional()
    readonly ocurrencias?: ActualizarOcurrenciaDTO[];
}

export class AsignarEncargadoDTO {
    @IsString()
    @IsNotEmpty()
    readonly usuarioId!: string;
}

export class ParticipantesDTO {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    readonly participantes!: string[];
}
