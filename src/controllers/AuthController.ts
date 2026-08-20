import { Controller, Post, Get, Body, Res, Req, UnauthorizedException, Inject, Injectable, Headers } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from '../services/AuthService';
import { CrearUsuarioDTO, UsuarioDTO } from '../DTO/UsuarioDTO';
import { LoginUsuarioDTO } from '../DTO/AuthUsuarioDTO';
import type { FastifyReply } from 'fastify';

@Injectable()
@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly usuariosService: AuthService) { }

  @Post('registro')
  async registrarUsuario(@Body() crearUsuarioDto: CrearUsuarioDTO, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
    const resultado = await this.usuariosService.registrarUsuario(crearUsuarioDto, headers);

    if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);

    res.status(resultado.status);
    return resultado.data;
  }
  //Falta terminar
  @Get('perfil')
  obtenerPerfil(@Req() req: Request) {
    const cookies = req.headers.cookie || '';
    const tieneToken = cookies.includes('better-auth.session_token');

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
  @Body() bodyLogin: LoginUsuarioDTO,
  @Headers() headers: Record<string, string>,
  @Res({ passthrough: true }) res: Response,
) {
  const resultado = await this.usuariosService.iniciarSesion(
    bodyLogin,
    headers,
  );

  console.log('COOKIES CORE:', resultado.cookies);

  if (resultado.cookies && resultado.cookies.length > 0) {
res.setHeader('Set-Cookie', resultado.cookies);

  }

  res.status(resultado.status);

  return resultado.data ?? { ok: true };
}
  //Falta conectar al service y demas
  @Post('logout')
  async cerrarSesion(@Res({ passthrough: true }) res: Response) {

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ ok: true, message: 'Sesión cerrada correctamente' });
  }
}