import { Controller, Post, Body, Headers, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import type { ICorreoService } from '../interfaces/ICorreoService';
import {CorreoDTO,CorreoConfirmacionCuentaDTO, CorreoRecuperacionContrasenaDTO,} from '../DTO/CorreoDTO';

@Controller('api/correo')
export class CorreoController {
  constructor(@Inject('ICorreoService') private readonly correoService: ICorreoService,) {}

  @Post('/notificacion')
  @HttpCode(HttpStatus.OK)
  async enviarNotificacion(@Body() correoDto: CorreoDTO,@Headers() headers: Record<string, string>,) {
    const enviado = await this.correoService.enviarNotificacion(correoDto, headers);

    return enviado
      ? { ok: true, mensaje: 'Correo enviado correctamente.' }
      : { ok: false, mensaje: 'No se pudo enviar el correo.' };
  }

  @Post('/cuenta/confirmacion')
  @HttpCode(HttpStatus.OK)
  async enviarCorreoConfirmacionCuenta(@Body() correoDto: CorreoConfirmacionCuentaDTO,@Headers() headers: Record<string, string>, ) {
    const enviado = await this.correoService.enviarCorreoConfirmacionCuenta(correoDto, headers);

    return enviado
      ? { ok: true, mensaje: 'Correo de confirmación enviado correctamente.' }
      : { ok: false, mensaje: 'No se pudo enviar el correo de confirmación.' };
  }

  @Post('/recuperacion')
  @HttpCode(HttpStatus.OK)
  async enviarCorreoRecuperacionContrasena(@Body() correoDto: CorreoRecuperacionContrasenaDTO,@Headers() headers: Record<string, string>,) {
    const enviado = await this.correoService.enviarCorreoRecuperacionContraseña(correoDto, headers);

    return enviado
      ? { ok: true, mensaje: 'Correo de recuperación enviado correctamente.' }
      : { ok: false, mensaje: 'No se pudo enviar el correo de recuperación.' };
  }

  @Post('/solicitud/confirmacion')
  @HttpCode(HttpStatus.OK)
  async enviarCorreoConfirmacionSolicitudAEvento(@Body() correoDto: CorreoDTO, @Headers() headers: Record<string, string>,) {
    const enviado =
      await this.correoService.enviarCorreoConfirmacionSolicitudAEvento(
        correoDto,
        headers,
      );

    return enviado
      ? { ok: true, mensaje: 'Correo de confirmación enviado correctamente.' }
      : { ok: false, mensaje: 'No se pudo enviar el correo de confirmación.' };
  }
}