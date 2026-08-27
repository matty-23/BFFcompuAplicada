import { LoginUsuarioDTO, RegistrarUsuarioDTO } from '../DTO/AuthUsuarioDTO';
import { CoreResponse } from './CoreResponse';

export interface IAuthService{
    registrarUsuario(dto: RegistrarUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse>;
    iniciarSesion(bodyLogin: LoginUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse>;
    validarSesion(headers: Record<string, string>): Promise<CoreResponse>;
    cerrarSesion(headers: Record<string, string>);
}