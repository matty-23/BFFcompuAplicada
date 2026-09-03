import {LoginUsuarioDTO, RegistrarUsuarioDTO, CorreoRecuperacionContrasenaDTO, RestablecerContrasenaDTO } from "../../src/DTO/AuthUsuarioDTO"; 

export const registrarUsuarioDtoMock: RegistrarUsuarioDTO = {
    name: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
    password: "Password123!",
    departamento: "Secretaria"
};

export const loginUsuarioDtoMock: LoginUsuarioDTO = {
    name: "Juan",
    email: "juan@example.com",
    password: "Password123!"
};

export const correoRecuperacionDtoMock: CorreoRecuperacionContrasenaDTO = {
    email: "juan@example.com",
    redirectTo: "http://localhost:3000/reset"
};

export const restablecerContrasenaDtoMock: RestablecerContrasenaDTO = {
    newPassword: "NewPassword123!",
    token: "token-secreto-123"
};

export const loginRespuestaBackendMock = {
    user: {
        id: "1",
        email: "juan@example.com",
        name: "Juan"}};

export const registroRespuestaBackendMock = {
  token: "asssss",
  user: {
    id: "1",
    correo: "juan@example.com",
    nombre: "Juan",
    apellido: "Pérez",
    departamento: "Secretaria",
    rol: 1,
  },
};