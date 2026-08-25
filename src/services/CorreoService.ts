import { CorreoDTO,CorreoConfirmacionCuentaDTO,CorreoRecuperacionContrasenaDTO } from "../DTO/CorreoDTO";
import { ICorreoClient } from "../interfaces/ICorreoClient";
import { ICorreoService } from "../interfaces/ICorreoService";

export class CorreoService implements ICorreoService{
    constructor(private readonly correoClient:ICorreoClient){}
    //En el futuro se puede hacer que con el DTO de confirmacion solicitud evento tambien viaje el id del mismo
    async enviarNotificacion(correo: CorreoDTO, headers: Record<string, any>):Promise<boolean> {
        return await this.correoClient.enviarNotificacion(correo,headers);
    }
    async enviarCorreoConfirmacionCuenta(correo:CorreoConfirmacionCuentaDTO, headers: Record<string, any>):Promise<boolean>{
        return await this.correoClient.enviarCorreoCuenta(correo,headers);
    }
    async enviarCorreoRecuperacionContraseña(correo:CorreoRecuperacionContrasenaDTO, headers: Record<string, any>):Promise<boolean>{
        return await this.correoClient.enviarCorreoRecuperacion(correo,headers);
    }
    async enviarCorreoConfirmacionSolicitudAEvento(correo:CorreoDTO, headers: Record<string, any>):Promise<boolean>{
        return this.correoClient.enviarCorreoConfirmacionSolicitud(correo,headers);
    }
}