import { LoginUsuarioDTO } from '../DTO/AuthUsuarioDTO';
import { CoreResponse } from './CoreResponse';
import { CrearUsuarioDTO } from '../DTO/UsuarioDTO';

export interface IAuthService{
    registrarUsuario(dto: CrearUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse>;
    iniciarSesion(bodyLogin: LoginUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse>;
    validarSesion(headers: Record<string, string>): Promise<CoreResponse>;
    cerrarSesion(headers: Record<string, string>);
}