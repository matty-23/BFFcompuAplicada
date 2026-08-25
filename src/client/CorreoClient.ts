import { ICorreoClient } from "../interfaces/ICorreoClient"
import { CorreoDTO, CorreoConfirmacionCuentaDTO, CorreoRecuperacionContrasenaDTO } from "../DTO/CorreoDTO"

export class CorreoClient implements ICorreoClient {

    async enviarNotificacion(correo: CorreoDTO, headers: Record<string, any>): Promise<boolean> {
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
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const resultado: boolean = await response.json();
        return resultado;
    }

    async enviarCorreoCuenta(correo: CorreoConfirmacionCuentaDTO, headers: Record<string, any>): Promise<boolean> {
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
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const resultado: boolean = await response.json();
        return resultado;
    }

    async enviarCorreoRecuperacion(correo: CorreoRecuperacionContrasenaDTO, headers: Record<string, any>): Promise<boolean> {
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
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const resultado: boolean = await response.json();
        return resultado;
    }

    async enviarCorreoConfirmacionSolicitud(correo: CorreoDTO, headers: Record<string, any>): Promise<boolean> {
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
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const resultado: boolean = await response.json();
        return resultado;
    }
}