import { CoreResponse } from "../interfaces/CoreResponse";
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { type IUsuarioClient } from "../interfaces/IUsuarioClient";
import { IUsuarioService } from "../interfaces/IUsuarioService";
import { UsuarioDTO } from "../DTO/UsuarioDTO";
import { CambiarContraseñaDTO } from "../DTO/AuthUsuarioDTO";

@Injectable()
export class UsuarioService implements IUsuarioService {
    constructor(@Inject('IUsuarioClient') private readonly usuarioClient: IUsuarioClient) { }

    async obtenerUsuario(headers: Record<string, any>, id: string): Promise<CoreResponse> {
        try {
            const respuesta = await this.usuarioClient.obtenerUsuario(headers, id);
            return respuesta;

        } catch (error) {
            if (error instanceof HttpException) throw error;

            const mensajeError = error instanceof Error ? error.message : 'Error interno inesperado en el BFF';

            throw new HttpException(
                {
                    message: mensajeError,
                    origen: 'BFF'
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                { cause: error }
            );

        }
    }

    async obtenerUsuarios(headers: Record<string, any>): Promise<CoreResponse> {
        try {
            return await this.usuarioClient.listarUsuarios(headers);
        } catch (error) {
            if (error instanceof HttpException) throw error;

            const mensajeError = error instanceof Error ? error.message : 'Error interno inesperado en el BFF';

            throw new HttpException(
                {
                    message: mensajeError,
                    origen: 'BFF'
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
                { cause: error }
            );
        }
    }

    async listarUsuarios(headers: Record<string, any>, filtros: Record<string, string>): Promise<CoreResponse> {
        try {
            return await this.usuarioClient.listarUsuarios(headers, filtros)
        } catch (error) {
            if (error instanceof HttpException)throw error;

        const mensajeError = error instanceof Error ? error.message : 'Error interno inesperado en el BFF';

        throw new HttpException(
            {
                message: mensajeError,
                origen: 'BFF'
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: error }
        );
        }
    } 

    async actualizarUsuario(usuario: UsuarioDTO, headers: Record<string, any>): Promise<CoreResponse> {
        try{
            const respuesta = await this.usuarioClient.actualizarUsuario(usuario,headers);
            return respuesta;
        }
        catch(error){
            if (error instanceof HttpException)throw error;

        const mensajeError = error instanceof Error ? error.message : 'Error interno inesperado en el BFF';

        throw new HttpException(
            {
                message: mensajeError,
                origen: 'BFF'
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: error }
        );
        }
    }

    async actualizarContraseña(body: CambiarContraseñaDTO, headers: Record<string, any>): Promise<CoreResponse> {
        try{
            const respuesta = await this.usuarioClient.actualizarContraseña(body,headers);
            return respuesta;
        }
        catch(error){
            if (error instanceof HttpException)throw error;

        const mensajeError = error instanceof Error ? error.message : 'Error interno inesperado en el BFF';

        throw new HttpException(
            {
                message: mensajeError,
                origen: 'BFF'
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: error }
        );
        }
    }

    async eliminarUsuario(headers: Record<string, any>, id: string) {
        try{
            const respuesta = await this.usuarioClient.eliminarUsuario(headers,id);
            return respuesta;
        }
        catch(error){
            if (error instanceof HttpException)throw error;

        const mensajeError = error instanceof Error ? error.message : 'Error interno inesperado en el BFF';

        throw new HttpException(
            {
                message: mensajeError,
                origen: 'BFF'
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            { cause: error }
        );
        }
    }
}