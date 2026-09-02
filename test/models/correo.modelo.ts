import { CorreoDTO, CorreoConfirmacionCuentaDTO, PrioridadCorreo } from '../../src/DTO/CorreoDTO';

export const correoDtoMock: CorreoDTO = {
    destinatarios: ['usuario@test.com'],
    asunto: 'Notificación del sistema',
    mensajeHtml: '<p>Hola, esto es una prueba</p>',
    prioridad: PrioridadCorreo.NORMAL,
};

export const correoConfirmacionCuentaDtoMock: CorreoConfirmacionCuentaDTO = {
    destinatario: 'nuevo@test.com',
    asunto: 'Bienvenido',
    mensajeConfirmacion: 'Por favor confirma tu cuenta haciendo clic aquí.',
};

