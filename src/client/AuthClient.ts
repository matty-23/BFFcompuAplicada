import { Injectable } from '@nestjs/common';
import "dotenv/config";
import { CoreResponse } from '../interfaces/CoreResponse';
import { RegistrarUsuarioDTO, LoginUsuarioDTO } from "../DTO/AuthUsuarioDTO"

@Injectable()
export class AuthClient {

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

  async registrarUsuario(body: RegistrarUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse> {
    const url = `${process.env.coreBaseUrl}/sign-up/email`;
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

  async iniciarSesion(body: LoginUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse> {
    const url = `${process.env.coreBaseUrl}/sign-in/email`;
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
  //No es una funcion necesaria
  // async crearUsuarioAdmin(body: any, headers: Record<string, any>): Promise<CoreResponse> {
  //   const url = `${process.env.coreBaseUrl}/register`;

  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       ...headers,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(body),
  //   });

  //   const data = await response.json().catch(() => null);

  //   return {
  //     status: response.status,
  //     data,
  //     cookies: this.extraerCookies(response),
  //   };
  // }
}