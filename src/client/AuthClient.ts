import { Injectable } from '@nestjs/common';
import { CoreResponse } from '../interfaces/CoreResponse';
import { RegistrarUsuarioDTO, LoginUsuarioDTO } from "../DTO/AuthUsuarioDTO"
import { IAuthClient } from '../interfaces/IAuthClient';

@Injectable()
export class AuthClient implements IAuthClient {

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
  //Esto puede quedar igual al IniciarSesion con el tema cookies
  async registrarUsuario(body: RegistrarUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse> {
    const url = `${process.env.coreBaseUrl}/api/auth/sign-up/email`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(headers.origin && { 'Origin': headers.origin }),
        ...(headers.cookie && { 'Cookie': headers.cookie }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);
    console.log('COOKIES CORE:', data.cookies);
    return {
      status: response.status,
      data,
      cookies: this.extraerCookies(response),
    };
  }

  async iniciarSesion(body: LoginUsuarioDTO, headers: Record<string, any>): Promise<CoreResponse> {
    const url = `${process.env.coreBaseUrl}/api/auth/sign-in/email`;

    const newHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (headers.origin) {
      newHeaders['Origin'] = headers.origin;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...newHeaders
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

  async validarSesion(headers: Record<string, string>): Promise<CoreResponse> {
  const response = await fetch(
    `${process.env.coreBaseUrl}/api/auth/get-session`,
    {
      method: 'GET',
      headers: {
        ...(headers.origin && { Origin: headers.origin }),
        ...(headers.cookie && { Cookie: headers.cookie }),
      },
    },
  );

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
  async cerrarSesion(headers: Record<string, string>): Promise<CoreResponse> {
    const response = await fetch(`${process.env.coreBaseUrl}/api/auth/sign-out`,
      {
        method: 'POST',
        headers: {
          ...(headers.cookie && { Cookie: headers.cookie }),
          ...(headers.origin && { Origin: headers.origin }),
        },
      },
    );

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data,
      cookies: this.extraerCookies(response),
    };
  }
}