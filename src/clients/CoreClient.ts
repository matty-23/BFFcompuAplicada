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

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data,
      cookies: this.extraerCookies(response),
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

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data,
      cookies: this.extraerCookies(response),
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

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data,
      cookies: this.extraerCookies(response),
    };
  }
}