import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Headers, Res, Inject } from '@nestjs/common';
import type { Response } from 'express';
import type { IUsuarioService } from '../interfaces/IUsuarioService';
import { UsuarioDTO } from '../DTO/UsuarioDTO';
import { CambiarContraseñaDTO } from '../DTO/AuthUsuarioDTO';

@Controller('api/usuario')
export class UsuarioController {
    constructor(@Inject('IUsuarioService') private readonly usuarioService: IUsuarioService) { }

    @Get('/todos')
    async obtenerUsuarios(@Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.obtenerUsuarios(headers);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Get('/filtros')
    async listarUsuarios(@Query() filtros: Record<string, string>, @Headers() headers: Record<string, string>, @Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.listarUsuarios(headers, filtros);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Get(':id')
    async obtenerUsuario(@Param('id') id: string,@Headers() headers: Record<string, string>,@Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.obtenerUsuario(headers, id);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Patch()
    async actualizarUsuario(@Body() usuarioDto: UsuarioDTO,@Headers() headers: Record<string, string>,@Res({ passthrough: true }) res: Response) {
        
        const resultado = await this.usuarioService.actualizarUsuario(usuarioDto, headers);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Post('/cambiar/contra')
    async actualizarContrasena( @Body() body: CambiarContraseñaDTO,@Headers() headers: Record<string, string>,@Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.actualizarContraseña(body, headers);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }

    @Delete(':id')
    async eliminarUsuario(@Param('id') id: string,@Headers() headers: Record<string, string>,@Res({ passthrough: true }) res: Response) {
        const resultado = await this.usuarioService.eliminarUsuario(headers, id);

        if (resultado.cookies && resultado.cookies.length > 0) res.setHeader('Set-Cookie', resultado.cookies);
        res.status(resultado.status);

        return resultado.data;
    }
}