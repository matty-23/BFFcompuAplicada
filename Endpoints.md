# Documentación de API - NestJS Backend (V2)

Este documento contiene la especificación de los endpoints para los módulos de Autenticación, Correos, Eventos, Solicitudes y Usuarios.

> **Base URL**: `http://localhost:xxxx`

---

## Índice

1. [Módulo de Autenticación (`/auth`)](#1-módulo-de-autenticación)
2. [Módulo de Correo (`/api/correo`)](#2-módulo-de-correo)
3. [Módulo de Eventos (`/api/eventos`)](#3-módulo-de-eventos)
4. [Módulo de Solicitudes (`/api/solicitudes`)](#4-módulo-de-solicitudes)
5. [Módulo de Usuarios (`/api/usuario`)](#5-módulo-de-usuarios)
6. [Tabla Resumen de Rutas](#6-tabla-resumen-de-rutas)

---

## 1. Módulo de Autenticación

**Controlador**: `AuthController`  
**Ruta Base**: `http://localhost:xxxx/auth`  

---

### 1.1. Registro de usuario
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/auth/registro`
- **Guards**: Ninguno (Público)
- **Cuerpo de la petición (`Body`)**: `RegistrarUsuarioDTO`
- **Cabeceras (`Headers`)**: Pasa los headers de la petición al servicio.
- **Respuesta**: Retorna la información de usuario/sesión registrada y establece la cookie en la respuesta (`Set-Cookie`).

---

### 1.2. Validar perfil / sesión
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/auth/perfil`
- **Guards**: `AuthGuard`
- **Cabeceras (`Headers`)**: Headers con la sesión/cookie activa.
- **Respuesta**: Validación del estado de la sesión activa del usuario.

---

### 1.3. Iniciar sesión (Login)
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/auth/login`
- **Guards**: Ninguno (Público)
- **Cuerpo de la petición (`Body`)**: `LoginUsuarioDTO`
- **Cabeceras (`Headers`)**: Headers requeridos por el servicio de autenticación.
- **Respuesta**: Datos del usuario e inicio de sesión. Establece cookie de sesión (`Set-Cookie`).

---

### 1.4. Cerrar sesión (Logout)
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/auth/logout`
- **Guards**: `AuthGuard`
- **Cabeceras (`Headers`)**: Headers con token o cookie de sesión (`better-auth.session_token`).
- **Respuesta**: Invalida la sesión actual en el sistema y limpia la caché asignada al token del usuario.

---

### 1.5. Solicitar recuperación de contraseña
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/auth/recuperacion`
- **Guards**: Ninguno (Público)
- **Cuerpo de la petición (`Body`)**: `CorreoRecuperacionContrasenaDTO`
- **Respuesta**: Inicia el proceso de recuperación de clave enviando las instrucciones por correo.

---

### 1.6. Restablecer contraseña
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/auth/restablecer`
- **Guards**: Ninguno (Público)
- **Cuerpo de la petición (`Body`)**: `RestablecerContrasenaDTO`
- **Respuesta**: Restablece la contraseña del usuario con los datos proporcionados.

---

## 2. Módulo de Correo

**Controlador**: `CorreoController`  
**Ruta Base**: `http://localhost:xxxx/api/correo`  
**Guards Globales**: `AuthGuard`, `PermissionsGuard`

---

### 2.1. Enviar correo de notificación
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/api/correo/notificacion`
- **Código Estado Éxito**: `200 OK`
- **Permisos requeridos**: `RECIBIR_NOTIFICACIONES`
- **Cuerpo de la petición (`Body`)**: `CorreoDTO`
- **Respuesta**: `{ ok: boolean, mensaje: string }`
- **Descripción**: Envía una notificación por correo electrónico.

---

### 2.2. Enviar correo de confirmación de cuenta
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/api/correo/cuenta/confirmacion`
- **Código Estado Éxito**: `200 OK`
- **Permisos requeridos**: `RECIBIR_NOTIFICACIONES`
- **Cuerpo de la petición (`Body`)**: `CorreoConfirmacionCuentaDTO`
- **Respuesta**: `{ ok: boolean, mensaje: string }`
- **Descripción**: Envía un correo de verificación para confirmación de cuenta.

---

### 2.3. Enviar correo de confirmación de solicitud a evento
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/api/correo/solicitud/confirmacion`
- **Código Estado Éxito**: `200 OK`
- **Permisos requeridos**: `RECIBIR_NOTIFICACIONES`
- **Cuerpo de la petición (`Body`)**: `CorreoDTO`
- **Respuesta**: `{ ok: boolean, mensaje: string }`
- **Descripción**: Envía la notificación de confirmación para una solicitud vinculada a un evento.

---

## 3. Módulo de Eventos

**Controlador**: `EventoController`  
**Ruta Base**: `http://localhost:xxxx/api/eventos`  
**Guards Globales**: `AuthGuard`, `PermissionsGuard`

---

### 3.1. Obtener todos los eventos
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/eventos`
- **Permisos requeridos**: `LISTAR_EVENTOS`
- **Respuesta**: `200 OK` - Arreglo con la representación en JSON de todos los eventos.

---

### 3.2. Búsqueda blanda / Filtro de eventos
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/eventos/filtros`
- **Parámetros de Consulta (`Query`)**: `filtrosEventoDto`
- **Permisos requeridos**: `LISTAR_EVENTOS`
- **Respuesta**: `200 OK` - `{ ok: boolean, cantidad: number, data: Evento[] }` o payload de error.

---

### 3.3. Obtener evento por ID
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/eventos/:id`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID único del evento.
- **Permisos requeridos**: `LISTAR_EVENTOS`, `VER_DETALLES_EVENTOS`, `DEJAR_COMENTARIOS_EVENTOS`, `MODIFICAR_EVENTOS`
- **Respuesta**: `200 OK` - Objeto JSON del evento. Si no existe, retorna HTTP 404.

---

### 3.4. Crear evento multi-día
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/api/eventos`
- **Código Estado Éxito**: `201 Created`
- **Permisos requeridos**: `AÑADIR_EVENTOS`
- **Cuerpo de la petición (`Body`)**: `CrearEventoMultiDTO`
- **Respuesta**: `201 Created` - JSON del evento recién creado. Si falla, arroja HTTP 400.

---

### 3.5. Actualizar evento
- **Método**: `PUT`
- **URL**: `http://localhost:xxxx/api/eventos/:id`
- **Código Estado Éxito**: `204 No Content`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID del evento a modificar.
- **Permisos requeridos**: `MODIFICAR_EVENTOS`, `DEJAR_COMENTARIOS_EVENTOS`, `MODIFICAR_COMENTARIOS_EVENTOS`, `ELIMINAR_COMENTARIOS_EVENTOS`
- **Cuerpo de la petición (`Body`)**: `ActualizarEventoDTO`

---

### 3.6. Eliminar evento
- **Método**: `DELETE`
- **URL**: `http://localhost:xxxx/api/eventos/:id`
- **Código Estado Éxito**: `204 No Content`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID del evento a eliminar.
- **Permisos requeridos**: `ELIMINAR_EVENTOS`

---

### 3.7. Actualizar ocurrencia de un evento
- **Método**: `PATCH`
- **URL**: `http://localhost:xxxx/api/eventos/:idEvento/ocurrencias/:idOcurrencia`
- **Parámetros de Ruta (`Param`)**:
  - `idEvento` (string, obligatorio): ID del evento principal.
  - `idOcurrencia` (string, obligatorio): ID de la ocurrencia.
- **Cuerpo de la petición (`Body`)**: `ActualizarOcurrenciaDTO`
- **Respuesta**: `200 OK` - JSON con la información del evento u ocurrencia actualizada.

---

### 3.8. Agregar participantes a una ocurrencia
- **Método**: `PATCH`
- **URL**: `http://localhost:xxxx/api/eventos/ocurrencias/:idOcurrencia/participantes`
- **Código Estado Éxito**: `204 No Content`
- **Parámetros de Ruta (`Param`)**:
  - `idOcurrencia` (string, obligatorio): ID de la ocurrencia.
- **Permisos requeridos**: `AÑADIR_PARTICIPANTE`
- **Cuerpo de la petición (`Body`)**: `{ participantes: string[] }`

---

### 3.9. Borrar participante de una ocurrencia
- **Método**: `DELETE`
- **URL**: `http://localhost:xxxx/api/eventos/ocurrencias/:idOcurrencia/participantes/:usuarioId`
- **Parámetros de Ruta (`Param`)**:
  - `idOcurrencia` (string, obligatorio): ID de la ocurrencia.
  - `usuarioId` (string, obligatorio): ID del usuario participante a remover.
- **Permisos requeridos**: `ELIMINAR_PARTICIPANTE`
- **Respuesta**: `200 OK` - `{ ok: true }`

---

## 4. Módulo de Solicitudes

**Controlador**: `SolicitudController`  
**Ruta Base**: `http://localhost:xxxx/api/solicitudes`  

---

### 4.1. Listar solicitudes (Con filtros)
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/solicitudes`
- **Parámetros de Consulta (`Query`)**:
  - `filtros`: `FiltrosSolicitudDTO` (ej. `estado=pendiente`)
  - `page` (number, opcional): Número de página (default: `1`).
- **Respuesta**: `200 OK` - Arreglo de solicitudes serializadas a JSON.

---

### 4.2. Listar mis solicitudes
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/solicitudes/mis`
- **Parámetros de Consulta (`Query`)**:
  - `page` (number, opcional): Número de página (default: `1`).
- **Respuesta**: `200 OK` - Lista de las solicitudes creadas por el usuario autenticado.

---

### 4.3. Obtener solicitud por ID
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/solicitudes/:id`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID de la solicitud.
- **Respuesta**: `200 OK` - Objeto JSON de la solicitud. Si no existe, lanza un HTTP 404.

---

### 4.4. Crear nueva solicitud
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/api/solicitudes`
- **Código Estado Éxito**: `201 Created`
- **Cuerpo de la petición (`Body`)**: `CrearSolicitudDTO`
- **Respuesta**: `201 Created` - Datos de la solicitud creada.

---

### 4.5. Modificar solicitud
- **Método**: `PUT`
- **URL**: `http://localhost:xxxx/api/solicitudes/:id`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID de la solicitud a actualizar.
- **Cuerpo de la petición (`Body`)**: `ModificarSolicitudDTO`
- **Respuesta**: `200 OK` - Resultado del servicio de modificación.

---

### 4.6. Cancelar solicitud
- **Método**: `DELETE`
- **URL**: `http://localhost:xxxx/api/solicitudes/:id`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID de la solicitud a cancelar.
- **Respuesta**: `200 OK` - Cambia el estado de la solicitud a `cancelada`.

---

### 4.7. Aceptar solicitud
- **Método**: `PATCH`
- **URL**: `http://localhost:xxxx/api/solicitudes/:id/aceptar`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID de la solicitud a aceptar.
- **Cuerpo de la petición (`Body`)**: `AceptarSolicitudDTO`
- **Respuesta**: `200 OK` - Resultado del procesamiento y aceptación.

---

### 4.8. Rechazar solicitud
- **Método**: `PATCH`
- **URL**: `http://localhost:xxxx/api/solicitudes/:id/rechazar`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID de la solicitud a rechazar.
- **Cuerpo de la petición (`Body`)**: `RechazarSolicitudDTO` (Opcional)
- **Respuesta**: `200 OK` - Resultado del rechazo de la solicitud.

---

## 5. Módulo de Usuarios

**Controlador**: `UsuarioController`  
**Ruta Base**: `http://localhost:xxxx/api/usuario`  
**Guards Globales**: `AuthGuard`, `PermissionsGuard`

---

### 5.1. Obtener todos los usuarios
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/usuario/todos`
- **Permisos requeridos**: `LISTAR_USUARIOS`
- **Respuesta**: `200 OK` - Lista completa de usuarios. Establece cookies en respuesta si aplica.

---

### 5.2. Listar usuarios con filtros
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/usuario/filtros`
- **Parámetros de Consulta (`Query`)**: `GetUsuariosQueryDTO`
- **Permisos requeridos**: `LISTAR_USUARIOS`
- **Respuesta**: `200 OK` - Usuarios filtrados.

---

### 5.3. Obtener usuario por ID
- **Método**: `GET`
- **URL**: `http://localhost:xxxx/api/usuario/:id`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID del usuario.
- **Permisos requeridos**: `MODIFICAR_USUARIO_PROPIO`
- **Respuesta**: `200 OK` - Datos del usuario solicitado.

---

### 5.4. Actualizar datos de usuario
- **Método**: `PATCH`
- **URL**: `http://localhost:xxxx/api/usuario`
- **Permisos requeridos**: `MODIFICAR_USUARIO`, `MODIFICAR_USUARIO_PROPIO`
- **Cuerpo de la petición (`Body`)**: `UsuarioDTO`
- **Respuesta**: `200 OK` - Usuario actualizado.

---

### 5.5. Cambiar contraseña de usuario
- **Método**: `POST`
- **URL**: `http://localhost:xxxx/api/usuario/cambiar/contra`
- **Permisos requeridos**: `MODIFICAR_USUARIO_PROPIO`
- **Cuerpo de la petición (`Body`)**: `CambiarContraseñaDTO`
- **Respuesta**: `200 OK` - Resultado del cambio de clave.

---

### 5.6. Eliminar usuario
- **Método**: `DELETE`
- **URL**: `http://localhost:xxxx/api/usuario/:id`
- **Parámetros de Ruta (`Param`)**:
  - `id` (string, obligatorio): ID del usuario a eliminar.
- **Permisos requeridos**: `ELIMINAR_USUARIO`
- **Respuesta**: `200 OK` - Resultado de la eliminación del usuario.

---

## 6. Tabla Resumen de Rutas

| Método | URL Completa | Controlador | Guard / Permiso(s) |
| :--- | :--- | :--- | :--- |
| **POST** | `http://localhost:xxxx/auth/registro` | `AuthController` | Público |
| **GET** | `http://localhost:xxxx/auth/perfil` | `AuthController` | `AuthGuard` |
| **POST** | `http://localhost:xxxx/auth/login` | `AuthController` | Público |
| **POST** | `http://localhost:xxxx/auth/logout` | `AuthController` | `AuthGuard` |
| **POST** | `http://localhost:xxxx/auth/recuperacion` | `AuthController` | Público |
| **POST** | `http://localhost:xxxx/auth/restablecer` | `AuthController` | Público |
| **POST** | `http://localhost:xxxx/api/correo/notificacion` | `CorreoController` | `RECIBIR_NOTIFICACIONES` |
| **POST** | `http://localhost:xxxx/api/correo/cuenta/confirmacion` | `CorreoController` | `RECIBIR_NOTIFICACIONES` |
| **POST** | `http://localhost:xxxx/api/correo/solicitud/confirmacion` | `CorreoController` | `RECIBIR_NOTIFICACIONES` |
| **GET** | `http://localhost:xxxx/api/eventos` | `EventoController` | `LISTAR_EVENTOS` |
| **GET** | `http://localhost:xxxx/api/eventos/filtros` | `EventoController` | `LISTAR_EVENTOS` |
| **GET** | `http://localhost:xxxx/api/eventos/:id` | `EventoController` | `LISTAR_EVENTOS`, `VER_DETALLES_EVENTOS`, `DEJAR_COMENTARIOS_EVENTOS`, `MODIFICAR_EVENTOS` |
| **POST** | `http://localhost:xxxx/api/eventos` | `EventoController` | `AÑADIR_EVENTOS` |
| **PUT** | `http://localhost:xxxx/api/eventos/:id` | `EventoController` | `MODIFICAR_EVENTOS`, `DEJAR_COMENTARIOS_EVENTOS`, `MODIFICAR_COMENTARIOS_EVENTOS`, `ELIMINAR_COMENTARIOS_EVENTOS` |
| **DELETE** | `http://localhost:xxxx/api/eventos/:id` | `EventoController` | `ELIMINAR_EVENTOS` |
| **PATCH** | `http://localhost:xxxx/api/eventos/:idEvento/ocurrencias/:idOcurrencia` | `EventoController` | N/A (Guards de controlador) |
| **PATCH** | `http://localhost:xxxx/api/eventos/ocurrencias/:idOcurrencia/participantes` | `EventoController` | `AÑADIR_PARTICIPANTE` |
| **DELETE** | `http://localhost:xxxx/api/eventos/ocurrencias/:idOcurrencia/participantes/:usuarioId` | `EventoController` | `ELIMINAR_PARTICIPANTE` |
| **GET** | `http://localhost:xxxx/api/solicitudes` | `SolicitudController` | Público / Servicio |
| **GET** | `http://localhost:xxxx/api/solicitudes/mis` | `SolicitudController` | Público / Servicio |
| **GET** | `http://localhost:xxxx/api/solicitudes/:id` | `SolicitudController` | Público / Servicio |
| **POST** | `http://localhost:xxxx/api/solicitudes` | `SolicitudController` | Público / Servicio |
| **PUT** | `http://localhost:xxxx/api/solicitudes/:id` | `SolicitudController` | Público / Servicio |
| **DELETE** | `http://localhost:xxxx/api/solicitudes/:id` | `SolicitudController` | Público / Servicio |
| **PATCH** | `http://localhost:xxxx/api/solicitudes/:id/aceptar` | `SolicitudController` | Público / Servicio |
| **PATCH** | `http://localhost:xxxx/api/solicitudes/:id/rechazar` | `SolicitudController` | Público / Servicio |
| **GET** | `http://localhost:xxxx/api/usuario/todos` | `UsuarioController` | `LISTAR_USUARIOS` |
| **GET** | `http://localhost:xxxx/api/usuario/filtros` | `UsuarioController` | `LISTAR_USUARIOS` |
| **GET** | `http://localhost:xxxx/api/usuario/:id` | `UsuarioController` | `MODIFICAR_USUARIO_PROPIO` |
| **PATCH** | `http://localhost:xxxx/api/usuario` | `UsuarioController` | `MODIFICAR_USUARIO`, `MODIFICAR_USUARIO_PROPIO` |
| **POST** | `http://localhost:xxxx/api/usuario/cambiar/contra` | `UsuarioController` | `MODIFICAR_USUARIO_PROPIO` |
| **DELETE** | `http://localhost:xxxx/api/usuario/:id` | `UsuarioController` | `ELIMINAR_USUARIO` |
