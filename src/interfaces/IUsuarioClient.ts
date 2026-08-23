import { CambiarContraseñaDTO } from "../DTO/AuthUsuarioDTO";
import { UsuarioDTO } from "../DTO/UsuarioDTO"
import { CoreResponse } from "./CoreResponse";

export interface IUsuarioClient{
    obtenerUsuario(headers: Record<string, any>, id:string):Promise<CoreResponse>;
    actualizarUsuario(usuario: UsuarioDTO,headers: Record<string, any>):Promise<CoreResponse>;
    listarUsuarios(headers: Record<string, any>,filtros?: Record<string, string | string[]>): Promise<CoreResponse> ;
    actualizarContraseña(body:CambiarContraseñaDTO,headers: Record<string, any>): Promise<CoreResponse>;
    eliminarUsuario(headers: Record<string, any>,id:string);

}