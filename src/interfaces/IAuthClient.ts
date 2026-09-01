import { LoginUsuarioDTO, RestablecerContrasenaDTO } from '../DTO/AuthUsuarioDTO'
import { CoreResponse } from './CoreResponse'
import { RegistrarUsuarioDTO,CorreoRecuperacionContrasenaDTO } from '../DTO/AuthUsuarioDTO'

export interface IAuthClient{
    registrarUsuario(body: RegistrarUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse>
    iniciarSesion(body: LoginUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse>
    validarSesion(headers: Record<string, any>): Promise<CoreResponse>;
    cerrarSesion(headers: Record<string, any>): Promise<CoreResponse>;
    solicitarRecuperacion(body: CorreoRecuperacionContrasenaDTO, headers: Record<string, any>): Promise<CoreResponse>;
    restablecerContrasena(body: RestablecerContrasenaDTO, headers: Record<string, string>): Promise<CoreResponse>;
}