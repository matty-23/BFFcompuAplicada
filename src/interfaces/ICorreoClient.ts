import { CorreoDTO,CorreoConfirmacionCuentaDTO,CorreoRecuperacionContrasenaDTO } from "../DTO/CorreoDTO";
export interface ICorreoClient{
    enviarNotificacion(correo: CorreoDTO, headers: Record<string, any>):Promise<boolean>;
    enviarCorreoConfirmacionCuenta(correo:CorreoConfirmacionCuentaDTO, headers: Record<string, any>):Promise<boolean>;
    enviarCorreoRecuperacionContraseña(correo:CorreoRecuperacionContrasenaDTO, headers: Record<string, any>):Promise<boolean>;
    enviarCorreoConfirmacionSolicitudAEvento(correo: CorreoDTO, headers: Record<string, any>):Promise<boolean>;
}