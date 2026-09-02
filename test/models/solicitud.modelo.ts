import { CrearSolicitudDTO, ModificarSolicitudDTO, AceptarSolicitudDTO, RechazarSolicitudDTO, FiltrosSolicitudDTO } from '../../src/DTO/SolicitudDTO'; //[cite: 2]
import { SolicitudViewModel } from '../../src/viewModels/SolicitudViewModel'; //[cite: 1]

export const solicitudViewModelMock: SolicitudViewModel = {
    id: 'sol-1',
    tipoEvento: 'Conferencia',
    estado: 'Pendiente',
    cantidadPersonas: 50,
    bloques: []
} as unknown as SolicitudViewModel;

export const crearSolicitudDtoMock: CrearSolicitudDTO = {
    tipoEvento: 'Conferencia',
    cantidadPersonas: 50,
    necesidadOperario: true,
    autorizacionRectoria: false,
    bloques: [{ fechaInicio: '2026-09-10T10:00:00Z', fechaFinalizacion: '2026-09-10T12:00:00Z', lugar: 'Auditorio' }]
};

export const modificarSolicitudDtoMock: ModificarSolicitudDTO = { cantidadPersonas: 100 };
export const aceptarSolicitudDtoMock: AceptarSolicitudDTO = { tiempoAnticipacion: 30, cantidadOperariosDesignados: 2 };
export const rechazarSolicitudDtoMock: RechazarSolicitudDTO = { motivo: 'Falta de disponibilidad de aulas' };
export const filtrosSolicitudDtoMock: FiltrosSolicitudDTO = { estado: 'Pendiente' };

