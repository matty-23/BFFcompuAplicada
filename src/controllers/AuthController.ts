import { Controller, Post, Get, Body, Res, UseGuards, UnauthorizedException, Inject, Injectable, Headers } from '@nestjs/common';
import type { Response, Request } from 'express';
import type{ IAuthService } from '../interfaces/IAuthService';
import { CrearUsuarioDTO, UsuarioDTO } from '../DTO/UsuarioDTO';
import { LoginUsuarioDTO } from '../DTO/AuthUsuarioDTO';
import { AuthGuard } from '../guards/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';

@Controller('/auth')
export class AuthController {
  constructor(@Inject('IAuthService') private readonly authService: IAuthService,@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  @Post('/registro')
  async registrarUsuario(@Body() crearUsuarioDto: CrearUsuarioDTO, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
    const resultado = await this.authService.registrarUsuario(crearUsuarioDto, headers);

    if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);

    res.status(resultado.status);
    return resultado.data;
  }

  @Get('/perfil')
  @UseGuards(AuthGuard)
async validarPerfil(@Headers() headers: Record<string, string>) {
  return this.authService.validarSesion(headers);
}

  @Post('/login')
  async iniciarSesion(@Body() bodyLogin: LoginUsuarioDTO, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response,) {

    const resultado = await this.authService.iniciarSesion(bodyLogin, headers,);

    if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);

    res.status(resultado.status);

    return resultado.data;
  }

  @Post("/logout")
  @UseGuards(AuthGuard)
  async cerrarSesion(@Res({ passthrough: true }) res: Response,@Headers() headers: Record<string, string>,) {
    const resultado = await this.authService.cerrarSesion(headers);

    const cookieStr = headers.cookie || '';
    const match = cookieStr.match(/better-auth\.session_token=([^;]+)/);
    const token = match ? match[1] : cookieStr;

    if (token) {
        await this.cacheManager.del(token);
    }

    if (resultado.cookies?.length) res.setHeader('Set-Cookie', resultado.cookies);
    res.status(resultado.status);
    return resultado.data;
  }
}