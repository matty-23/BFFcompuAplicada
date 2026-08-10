import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CoreClient, CoreResponse } from '../client/CoreClient';
import { Usuario } from '../models/Usuario';
import { CrearUsuarioDto } from '../Dtos/UsuarioDTO';

@Injectable()
export class UsuariosService {
  // Definimos las cabeceras base que exige Better Auth
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
    'Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
  };

  constructor(private readonly coreClient: CoreClient) {}

  async registrarUsuario(dto: CrearUsuarioDto): Promise<CoreResponse> {
    try {
      const bodyAuth = {
        email: dto.correo,
        password: dto.contraseña,
        name: `${dto.nombre} ${dto.apellido}`.trim(),
      };

      // Se envían las cabeceras que incluyen Origin
      const resultadoAuth = await this.coreClient.registrarUsuario(bodyAuth, this.defaultHeaders);

      if (resultadoAuth.status >= 400) {
        return resultadoAuth;
      }

      const authUser = resultadoAuth.data.user || resultadoAuth.data;
      const setCookieHeader = resultadoAuth.cookies;

      const headersConSesion: Record<string, any> = { ...this.defaultHeaders };
      if (setCookieHeader && setCookieHeader.length > 0) {
        headersConSesion['cookie'] = setCookieHeader.map((c: string) => c.split(';')[0]).join('; ');
      }

      const nuevoUsuario = new Usuario(
        authUser.id || '',
        dto.nombre,
        dto.apellido,
        dto.correo,
        dto.departamento,
        dto.rol,
        dto.contraseña
      );

      const payloadNegocio = {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario._nombre,
        apellido: nuevoUsuario._apellido,
        correo: nuevoUsuario._correo,
        contraseña: nuevoUsuario._contraseña,
        departamento: nuevoUsuario._departamento,
        rol: nuevoUsuario._rol,
      };

      const resultadoNegocio = await this.coreClient.crearUsuarioNegocio(payloadNegocio, headersConSesion);

      if (resultadoNegocio.status >= 400) {
        return resultadoNegocio;
      }

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

  async iniciarSesion(bodyLogin: any): Promise<CoreResponse> {
    try {
      const bodyMapeado = {
        email: bodyLogin.correo || bodyLogin.email,
        password: bodyLogin.contraseña || bodyLogin.password,
      };

      // Se inyecta la cabecera Origin requerida por Better Auth
      return await this.coreClient.iniciarSesion(bodyMapeado, this.defaultHeaders);
    } catch (error) {
      console.error('Error conectando al Core en login:', error);
      throw new HttpException('El servidor principal no responde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}