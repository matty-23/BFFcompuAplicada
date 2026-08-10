import { Injectable } from '@nestjs/common';

export interface CoreResponse<T = any> {
  status: number;
  data: T;
  cookies?: string[];
}

@Injectable()
export class CoreClient {
  private readonly coreUrl = process.env.CORE_BACKEND_URL || 'http://127.0.0.1:3000/api/auth';
  private readonly coreApiUrl = 'http://127.0.0.1:3000/api';

  async registrarUsuario(body: any, headers: Record<string, any>): Promise<CoreResponse> {
    const url = `${this.coreUrl}/sign-up/email`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const cookies = response.headers.getSetCookie();

    return {
      status: response.status,
      data,
      cookies,
    };
  }

  async iniciarSesion(body: any, headers: Record<string, any>): Promise<CoreResponse> {
    const url = `${this.coreUrl}/sign-in/email`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const cookies = response.headers.getSetCookie();

    return {
      status: response.status,
      data,
      cookies,
    };
  }

  async crearUsuarioNegocio(body: any, headers: Record<string, any>): Promise<CoreResponse> {
    const url = `${this.coreApiUrl}/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Incluimos la propiedad de cookies aunque esté vacía para cumplir el contrato
    return {
      status: response.status,
      data,
      cookies: response.headers.getSetCookie(),
    };
  }
}