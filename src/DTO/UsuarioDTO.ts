import { IsNumber, IsString, IsNotEmpty, IsOptional, Max, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearUsuarioDTO {
    @IsString()
    @IsNotEmpty()
    readonly nombre!: string;

    @IsString()
    @IsNotEmpty()
    readonly apellido!: string;

    @IsString()
    @IsNotEmpty()
    readonly correo!: string;

    @IsString()
    @IsNotEmpty()
    readonly contraseña!: string;

    @IsString()
    @IsNotEmpty()
    readonly departamento!: string;

    @IsString()
    @IsNotEmpty()
    rol!: string;
}

export class UsuarioDTO {
    @IsString()
    @IsNotEmpty()
    readonly id!: string;

    @IsString()
    @IsNotEmpty()
    readonly nombre!: string;

    @IsString()
    @IsNotEmpty()
    readonly apellido!: string;

    @IsString()
    @IsNotEmpty()
    readonly correo!: string;

    @IsString()
    @IsOptional()
    readonly departamento?: string;

    @IsString()
    @IsNotEmpty()
    readonly rol!: string;
}


export class ActualizarUsuarioDTO {
}

export class ActualizarUsuarioCompletoDTO {
}

export class GetUsuariosQueryDTO {
    @IsOptional()
    @IsString()
    rol?: string;

    @IsOptional()
    @IsString()
    departamento?: string;

    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsIn(['nombre', 'apellido', 'correo'])
    ordenar: 'nombre' | 'apellido' | 'correo' = 'apellido';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    orden: 'asc' | 'desc' = 'asc';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    skip?: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 30;

}