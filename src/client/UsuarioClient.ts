import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IUsuarioClient } from '../interfaces/IUsuarioClient';
import { UsuarioDTO } from '../DTO/UsuarioDTO';
import { CoreResponse } from '../interfaces/CoreResponse';
import { CambiarContraseñaDTO } from '../DTO/AuthUsuarioDTO';

@Injectable()

export class UsuarioClient implements IUsuarioClient {

    private extraerCookies(response: Response): string[] {
        const cookies = response.headers.getSetCookie?.() ?? [];
        if (cookies.length > 0) {
            return cookies;
        }

        const cookieHeader = response.headers.get('set-cookie');
        if (!cookieHeader) {
            return [];
        }

        return Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader];
    }

    async obtenerUsuario(headers: Record<string, any>, id: string): Promise<CoreResponse> {
        const url = `${process.env.coreBaseUrl}/api/usuario/${id}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(headers.origin && { 'Origin': headers.origin }),
                ...(headers.cookie && { 'Cookie': headers.cookie }),
            }
        });

        const data = await response.json().catch(() => null);
        return {
            status: response.status,
            data,
            cookies: this.extraerCookies(response),
        };
    }

    async actualizarUsuario(body: UsuarioDTO, headers: Record<string, any>): Promise<CoreResponse> {
        const url = `${process.env.coreBaseUrl}/api/usuario/${body.id}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(headers.origin && { 'Origin': headers.origin }),
                ...(headers.cookie && { 'Cookie': headers.cookie }),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => null);
        return {
            status: response.status,
            data,
            cookies: this.extraerCookies(response),
        };
    }
    async actualizarContraseña(body: CambiarContraseñaDTO, headers: Record<string, any>): Promise<CoreResponse> {
        const url = `${process.env.coreBaseUrl}/api/auth/change-password`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(headers.origin && { Origin: headers.origin }),
                ...(headers.cookie && { Cookie: headers.cookie }),
            },
            body: JSON.stringify(body)

        });

        const data = await response.json().catch(() => null);
        return {
            status: response.status,
            data,
            cookies: this.extraerCookies(response),
        };
    }

    async listarUsuarios(headers: Record<string, any>,filtros?: Record<string, string | string[]>): Promise<CoreResponse> {
        const params = new URLSearchParams();

        if (filtros) {
            Object.entries(filtros).forEach(([key, value]) => {
                if (value === undefined || value === null) {
                    return;
                }

                if (Array.isArray(value)) {
                    value.forEach(item => params.append(key, item));
                } else {
                    params.append(key, value);
                }
            });
        }

        const queryString = params.toString();

        const url = `${process.env.coreBaseUrl}/api/usuarios${queryString ? `?${queryString}` : ''
            }`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...(headers.origin && { Origin: headers.origin }),
                ...(headers.cookie && { Cookie: headers.cookie }),
            },
        });

        const data = await response.json().catch(() => null);

        return {
            status: response.status,
            data,
            cookies: this.extraerCookies(response),
        };
    }


    async eliminarUsuario(headers: Record<string, any>, id: string) {
        const url = `${process.env.coreBaseUrl}/api/usuario/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                ...(headers.origin && { 'Origin': headers.origin }),
                ...(headers.cookie && { 'Cookie': headers.cookie }),
            }
        });

        const data = await response.json().catch(() => null);
        return {
            status: response.status,
            data,
            cookies: this.extraerCookies(response),
        };
    }
}