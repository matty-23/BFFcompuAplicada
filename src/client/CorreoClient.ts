import { ICorreoClient } from "../interfaces/ICorreoClient"
import { CorreoDTO, CorreoConfirmacionCuentaDTO,CorreoRecuperacionContrasenaDTO } from "../DTO/CorreoDTO"
export class CorreoClient implements ICorreoClient{
    //Revisar que devuelve CorreoRepository en backend
    async enviarNotificacion(correo: CorreoDTO, headers: Record<string, any>):Promise<boolean>{
        const url = `${process.env.coreBaseUrl}/notificaciones/confirmacion`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(headers.origin && { 'Origin': headers.origin }),
                ...(headers.cookie && { 'Cookie': headers.cookie }),
            },
            body: JSON.stringify(correo),
        });
        if(response) return true;
        return false;
    }
    async enviarCorreoConfirmacionCuenta(correo:CorreoConfirmacionCuentaDTO, headers: Record<string, any>):Promise<boolean>{
        const url = `${process.env.coreBaseUrl}/notificaciones/cuenta/confirmacion`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(headers.origin && { 'Origin': headers.origin }),
                ...(headers.cookie && { 'Cookie': headers.cookie }),
            },
            body: JSON.stringify(correo),
        });
        if(response) return true;
        return false;
    }
    async enviarCorreoRecuperacionContraseña(correo:CorreoRecuperacionContrasenaDTO, headers: Record<string, any>):Promise<boolean>{
        const url = `${process.env.coreBaseUrl}/notificaciones/recuperacion`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(headers.origin && { 'Origin': headers.origin }),
                ...(headers.cookie && { 'Cookie': headers.cookie }),
            },
            body: JSON.stringify(correo),
        });
        if(response) return true;
        return false;
    }
    async enviarCorreoConfirmacionSolicitudAEvento(correo:CorreoDTO, headers: Record<string, any>):Promise<boolean>{
        const url = `${process.env.coreBaseUrl}/notificaciones`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(headers.origin && { 'Origin': headers.origin }),
                ...(headers.cookie && { 'Cookie': headers.cookie }),
            },
            body: JSON.stringify(correo),
        });
        if(response) return true;
        return false;
    }
}