import { IsString, IsNotEmpty, IsOptional } from 'class-validator';


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
