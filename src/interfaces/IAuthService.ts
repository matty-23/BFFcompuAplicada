import { CorreoRecuperacionContrasenaDTO, LoginUsuarioDTO, RegistrarUsuarioDTO, RestablecerContrasenaDTO } from '../DTO/AuthUsuarioDTO';
import { CoreResponse } from './CoreResponse';

export interface IAuthService{
    registrarUsuario(dto: RegistrarUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse>;
    iniciarSesion(bodyLogin: LoginUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse>;
    validarSesion(headers: Record<string, string>): Promise<CoreResponse>;
    cerrarSesion(headers: Record<string, string>): Promise<CoreResponse>;
    solicitarRecuperacion(body: CorreoRecuperacionContrasenaDTO, headers: Record<string, string>): Promise<CoreResponse>
    restablecerContrasena(body: RestablecerContrasenaDTO, headers: Record<string, string>): Promise<CoreResponse>;
}