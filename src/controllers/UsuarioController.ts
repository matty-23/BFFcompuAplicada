import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Headers, Res, Inject,UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { IUsuarioService } from '../interfaces/IUsuarioService';
import { UsuarioDTO } from '../DTO/UsuarioDTO';
import { CambiarContraseñaDTO } from '../DTO/AuthUsuarioDTO';
import { GetUsuariosQueryDTO } from '../DTO/UsuarioDTO';
import { RequierePermiso } from '../decorators/permisos.decorator.js';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permiso } from '../models/roles/Permisos';

@Controller('api/usuario')
@UseGuards(PermissionsGuard)
export class UsuarioController {
    constructor(@Inject('IUsuarioService') private readonly usuarioService: IUsuarioService) { }

    @Get('/todos')
    @RequierePermiso(Permiso.LISTAR_USUARIOS)
    async obtenerUsuarios(@Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.obtenerUsuarios(headers);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }
    @Get('/filtros')
    @RequierePermiso(Permiso.LISTAR_USUARIOS)
    async listarUsuarios(@Query() filtros: GetUsuariosQueryDTO, @Headers() headers: Record<string, string>,@Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.listarUsuarios(headers, filtros);

        if (resultado.cookies?.length) {
            res.setHeader('Set-Cookie', resultado.cookies);
        }

        res.status(resultado.status);

        return resultado.data;
    }

    @Get(':id')
    @RequierePermiso(Permiso.MODIFICAR_USUARIO_PROPIO)
    async obtenerUsuario(@Param('id') id: string, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.obtenerUsuario(headers, id);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Patch()
    @RequierePermiso(Permiso.MODIFICAR_USUARIO,Permiso.MODIFICAR_USUARIO_PROPIO)
    async actualizarUsuario(@Body() usuarioDto: UsuarioDTO, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {

        const resultado = await this.usuarioService.actualizarUsuario(usuarioDto, headers);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Post('/cambiar/contra')
    @RequierePermiso(Permiso.MODIFICAR_USUARIO_PROPIO)
    async actualizarContrasena(@Body() body: CambiarContraseñaDTO, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.actualizarContraseña(body, headers);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Delete(':id')
    @RequierePermiso(Permiso.ELIMINAR_USUARIO)
    async eliminarUsuario(@Param('id') id: string, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.eliminarUsuario(headers, id);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }
}