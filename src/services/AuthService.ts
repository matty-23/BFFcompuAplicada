import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthClient} from '../client/AuthClient';
import { CoreResponse } from '../interfaces/CoreResponse';
import { Usuario } from '../models/Usuario';
import { CrearUsuarioDTO, UsuarioDTO } from '../DTO/UsuarioDTO';
import { LoginUsuarioDTO } from '../DTO/AuthUsuarioDTO';

@Injectable()
export class AuthService {
  // Definimos las cabeceras base que exige Better Auth
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
    'Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
  };

  constructor(private readonly coreClient: AuthClient) {}

  async registrarUsuario(dto: CrearUsuarioDTO): Promise<CoreResponse> {
    try {
      const bodyAuth = {
        email: dto.correo,
        password: dto.contraseña,
        name: dto.nombre,
        apellido:dto.apellido,
        departamento: dto.departamento,
      };

      const resultadoAuth = await this.coreClient.registrarUsuario(bodyAuth, this.defaultHeaders);

      if (resultadoAuth.status >= 400) {
        return resultadoAuth;
      }

      const authUser = resultadoAuth.data.user || resultadoAuth.data;
      const nuevoUsuario = new Usuario(
        authUser.id || '',
        dto.nombre,
        dto.apellido,
        dto.correo,
        dto.departamento,
        dto.rol,
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

  async iniciarSesion(bodyLogin: LoginUsuarioDTO): Promise<CoreResponse> {
    try {

      const resultado = await this.coreClient.iniciarSesion(bodyLogin, this.defaultHeaders);

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
}