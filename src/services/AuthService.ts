import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CoreResponse } from '../interfaces/CoreResponse';
import { Usuario } from '../models/Usuario';
import { LoginUsuarioDTO, RegistrarUsuarioDTO,CorreoRecuperacionContrasenaDTO,RestablecerContrasenaDTO } from '../DTO/AuthUsuarioDTO';
import {type  IAuthClient } from '../interfaces/IAuthClient';
import { IAuthService } from '../interfaces/IAuthService';

@Injectable()
export class AuthService implements IAuthService {

  constructor(@Inject('IAuthClient')private readonly coreClient: IAuthClient) {}

  async registrarUsuario(dto: RegistrarUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse> {
    try {
      const bodyAuth = {
        email: dto.email,
        password: dto.password,
        name: dto.name,
        apellido:dto.apellido,
        departamento: dto.departamento,
      };

      const resultadoAuth = await this.coreClient.registrarUsuario(bodyAuth, headers);

      if (resultadoAuth.status >= 400) {
        return resultadoAuth;
      }

      const authUser = resultadoAuth.data.user || resultadoAuth.data;
      const nuevoUsuario = new Usuario(
        authUser.id || '',
        dto.name,
        dto.apellido,
        dto.email,
        dto.departamento,
        authUser.rol,
        ""
      );


      return {
        status: 201,
        cookies: resultadoAuth.cookies,
        data: {
          auth: resultadoAuth.data,
          usuario: nuevoUsuario.toResponseObject(),
        },
      };
    } catch (error) {
      console.error('Error en el registro de usuario:', error);
      throw new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async iniciarSesion(bodyLogin: LoginUsuarioDTO,headers: Record<string, string>): Promise<CoreResponse> {
    try {

      const resultado = await this.coreClient.iniciarSesion(bodyLogin, headers);

      if (resultado.status >= 400) {
        return resultado;
      }

      return {
        status: resultado.status,
        data: resultado.data,
        cookies: resultado.cookies,
      };
    } catch (error) {
      console.error('Error conectando al Core en login:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

 async validarSesion(headers: Record<string, string>): Promise<CoreResponse> {
  return this.coreClient.validarSesion(headers);
}

async cerrarSesion( headers: Record<string, string>): Promise<CoreResponse> {
  return this.coreClient.cerrarSesion(headers);
}

async solicitarRecuperacion(body: CorreoRecuperacionContrasenaDTO, headers: Record<string, string>): Promise<CoreResponse> {
    try {
      const resultado = await this.coreClient.solicitarRecuperacion(body, headers);
      if (resultado.status >= 400) {
        return resultado;
      }
      return {
        status: resultado.status,
        data: resultado.data,
        cookies: resultado.cookies,
      };
    } catch (error) {
      console.error('Error conectando al Core en solicitarRecuperacion:', error);
      throw new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

async restablecerContrasena(body: RestablecerContrasenaDTO, headers: Record<string, string>): Promise<CoreResponse> {
    try {
      const resultado = await this.coreClient.restablecerContrasena(body, headers);
      if (resultado.status >= 400) {
        return resultado;
      }
      return {
        status: resultado.status,
        data: resultado.data,
        cookies: resultado.cookies,
      };
    } catch (error) {
      console.error('Error conectando al Core en restablecerContrasena:', error);
      throw new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}