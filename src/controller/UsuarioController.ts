import { Controller, Post, Get, Body, Res, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
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

  //Endpoint para probar si la cookie de sesión es válida y el usuario tiene acceso a la ruta protegida
  @Get('perfil')
  obtenerPerfil(@Req() req: Request) {
    const cookies = req.headers.cookie || '';
    const tieneToken = cookies.includes('access_token');

    if (!tieneToken) {
      throw new UnauthorizedException('Acceso denegado: No tienes una sesión activa.');
    }

    return { 
      ok: true, 
      message: '¡Estás dentro! Tu cookie es válida y tienes acceso a esta ruta protegida.' 
    };
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
    return resultado.data ?? { ok: true };
  }

  @Post('logout')
  async cerrarSesion(@Res({ passthrough: true }) res: Response) {

    res.clearCookie('access_token',{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ ok: true, message: 'Sesión cerrada correctamente' });
  }
}