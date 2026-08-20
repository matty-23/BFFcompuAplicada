import { LoginUsuarioDTO } from '../DTO/AuthUsuarioDTO'
import { CoreResponse } from './CoreResponse'
import { RegistrarUsuarioDTO } from '../DTO/AuthUsuarioDTO'

export interface IAuthClient{
    registrarUsuario(body: RegistrarUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse>
    iniciarSesion(body: LoginUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse>
    validarSesion(headers: Record<string, any>): Promise<CoreResponse>;
    cerrarSesion(headers: Record<string, any>)
}