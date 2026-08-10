import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UsuariosService } from '../service/UsuarioService';
import type { CrearUsuarioDto } from '../Dtos/UsuarioDTO';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  async crearUsuario(
    @Body() crearUsuarioDto: CrearUsuarioDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resultado = await this.usuariosService.registrarUsuario(crearUsuarioDto);

    // Si el Core devolvió cookies de sesión, las asignamos en la respuesta del BFF
    if (resultado.cookies && resultado.cookies.length > 0) {
      res.setHeader('Set-Cookie', resultado.cookies);
    }

    res.status(resultado.status);
    return resultado.data;
  }

  @Post('login')
  async iniciarSesion(
    @Body() bodyLogin: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resultado = await this.usuariosService.iniciarSesion(bodyLogin);

    if (resultado.cookies && resultado.cookies.length > 0) {
      res.setHeader('Set-Cookie', resultado.cookies);
    }

    res.status(resultado.status);
    return resultado.data;
  }
}