import { Controller, Post, Body, Headers, Inject, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import type { ICorreoService } from '../interfaces/ICorreoService';
import {CorreoDTO,CorreoConfirmacionCuentaDTO, } from '../DTO/CorreoDTO';
import { RequierePermiso } from '../decorators/permisos.decorator';
import { PermissionsGuard } from "../guards/permissions.guard";
import { Permiso } from "../models/roles/Permisos";
import { AuthGuard } from "../guards/auth.guard";

@Controller('api/correo')
@UseGuards(AuthGuard,PermissionsGuard)
export class CorreoController {
  constructor(@Inject('ICorreoService') private readonly correoService: ICorreoService,) {}

  @Post('/notificacion')
  @HttpCode(HttpStatus.OK)
  @RequierePermiso(Permiso.RECIBIR_NOTIFICACIONES)
  async enviarNotificacion(@Body() correoDto: CorreoDTO,@Headers() headers: Record<string, string>,) {
    const enviado = await this.correoService.enviarNotificacion(correoDto, headers);

    return enviado
      ? { ok: true, mensaje: 'Correo enviado correctamente.' }
      : { ok: false, mensaje: 'No se pudo enviar el correo.' };
  }

  @Post('/cuenta/confirmacion')
  @HttpCode(HttpStatus.OK)
  @RequierePermiso(Permiso.RECIBIR_NOTIFICACIONES)
  async enviarCorreoConfirmacionCuenta(@Body() correoDto: CorreoConfirmacionCuentaDTO,@Headers() headers: Record<string, string>, ) {
    const enviado = await this.correoService.enviarCorreoConfirmacionCuenta(correoDto, headers);

    return enviado
      ? { ok: true, mensaje: 'Correo de confirmación enviado correctamente.' }
      : { ok: false, mensaje: 'No se pudo enviar el correo de confirmación.' };
  }

  @Post('/solicitud/confirmacion')
  @HttpCode(HttpStatus.OK)
  @RequierePermiso(Permiso.RECIBIR_NOTIFICACIONES)
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