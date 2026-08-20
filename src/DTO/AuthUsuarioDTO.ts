import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

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

export class CambiarContraseñaDTO{

    @IsString()
    @IsNotEmpty()
    readonly id!:string;

    @IsString()
    @IsNotEmpty()
    readonly currentPassword!:string;
    
    @IsString()
    @IsNotEmpty()
    readonly newPassword!:string;

    @IsString()
    @IsOptional()
    readonly revokeOtherSessions?: boolean;
}