import { UsuarioDTO } from "../../src/DTO/UsuarioDTO";
import { CoreResponse } from "../../src/interfaces/CoreResponse";

export const usuarioModelo:UsuarioDTO = {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan.perez@example.com",
    rol: "admin",
};

export const CoreResponseOk=(data:any,cookies?:string[]): CoreResponse => {
    return {
        status: 200,
        data: data,
        cookies: cookies
    };
}