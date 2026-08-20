import { CambiarContraseñaDTO } from "../DTO/AuthUsuarioDTO";
import { UsuarioDTO } from "../DTO/UsuarioDTO";
import { CoreResponse } from "./CoreResponse";

export interface IUsuarioService{
    actualizarUsuario(usuario: UsuarioDTO,headers: Record<string, any>):Promise<CoreResponse>;
    actualizarContraseña(body:CambiarContraseñaDTO,headers: Record<string, any>): Promise<CoreResponse>;
    obtenerUsuarios(headers: Record<string, any>):Promise<CoreResponse>;
    obtenerUsuario(headers: Record<string, any>, id:string):Promise<CoreResponse>;
    listarUsuarios(headers: Record<string, any>,filtros:Record<string, string>):Promise<CoreResponse>;
    eliminarUsuario(headers: Record<string, any>,id:string);
}