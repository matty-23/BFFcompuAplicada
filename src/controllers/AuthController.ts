import { Controller, Post, Get, Body, Res, UseGuards, UnauthorizedException, Inject, Injectable, Headers } from '@nestjs/common';
import type { Response, Request } from 'express';
import type{ IAuthService } from '../interfaces/IAuthService';
import { CrearUsuarioDTO, UsuarioDTO } from '../DTO/UsuarioDTO';
import { LoginUsuarioDTO } from '../DTO/AuthUsuarioDTO';

@Controller('/auth')
export class AuthController {
  constructor(@Inject('IAuthService') private readonly authService: IAuthService) { }

  @Post('/registro')
  async registrarUsuario(@Body() crearUsuarioDto: CrearUsuarioDTO, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
    const resultado = await this.authService.registrarUsuario(crearUsuarioDto, headers);

    if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);

    res.status(resultado.status);
    return resultado.data;
  }

  @Get('/perfil')
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
  async cerrarSesion(@Res({ passthrough: true }) res: Response,@Headers() headers: Record<string, string>,) {
    const resultado = await this.authService.cerrarSesion(headers);

    if (resultado.cookies?.length) res.setHeader("Set-Cookie", resultado.cookies);

    res.status(resultado.status);
    return resultado.data;
  }
}