import { IsNumber, IsString, IsNotEmpty, IsOptional, Max, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarUsuarioDTO{
    @IsString()
    @IsNotEmpty()
    readonly name!:string;
    
    @IsString()
    @IsNotEmpty()
    readonly apellido!:string;
    
    @IsString()
    @IsNotEmpty()
    readonly email!:string;

    @IsString()
    @IsNotEmpty()
    readonly password!: string;

    @IsString()
    @IsNotEmpty()
    readonly departamento!:string;
}

export class LoginUsuarioDTO{
    @IsString()
    @IsNotEmpty()
    readonly name!:string;
    
    @IsString()
    @IsNotEmpty()
    readonly email!:string;

    @IsString()
    @IsNotEmpty()
    readonly password!: string;
}