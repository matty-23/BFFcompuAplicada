import { CorreoDTO,CorreoConfirmacionCuentaDTO } from "../DTO/CorreoDTO";
export interface ICorreoClient{
    enviarNotificacion(correo: CorreoDTO, headers: Record<string, any>):Promise<boolean>;
    enviarCorreoCuenta(correo:CorreoConfirmacionCuentaDTO, headers: Record<string, any>):Promise<boolean>;
    enviarCorreoConfirmacionSolicitud(correo: CorreoDTO, headers: Record<string, any>):Promise<boolean>;
}