import { ICorreoClient } from "../interfaces/ICorreoClient"
import { CorreoDTO, CorreoConfirmacionCuentaDTO} from "../DTO/CorreoDTO"

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
            const errorDetails = await response.text(); 
            throw new Error(`Error ${response.status}: ${errorDetails}`);
        }
        
        const text = await response.text();

        if (!text) {
            return true;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            return true;
        }
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
            const errorDetails = await response.text(); 
            throw new Error(`Error ${response.status}: ${errorDetails}`);
        }
        
        const text = await response.text();

        if (!text) {
            return true;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            return true;
        }
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
            const errorDetails = await response.text(); 
            throw new Error(`Error ${response.status}: ${errorDetails}`);
        }
        
        const text = await response.text();

        if (!text) {
            return true;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            return true;
        }
    }
}