import { CrearEventoMultiDTO, ActualizarEventoDTO, ActualizarOcurrenciaDTO } from '../../src/DTO/EventoDTO';
import { EventoViewModel } from '../../src/viewModels/EventoViewModel';
import { filtrosEventoDto } from '../../src/DTO/FiltrosDto';

export const eventoViewModelMock = {
    id: '1',
    titulo: 'Evento de Prueba',
    categoria: 'Académico',
    estado: 'Aprobado',
    color: '#FFFFFF',
    ocurrencias: []
} as unknown as EventoViewModel;

export const crearEventoMultiDtoMock: CrearEventoMultiDTO = {
    titulo: 'Evento Multi',
    ocurrencias: [{ fechaInicio: '2025-01-01T10:00:00Z', fechaFinalizacion: '2025-01-01T12:00:00Z', lugar: 'Aula 1', cantidadPersonas: 20 }]
};

export const actualizarEventoDtoMock: ActualizarEventoDTO = { titulo: 'Evento Modificado' };
export const actualizarOcurrenciaDtoMock: ActualizarOcurrenciaDTO = { id: 'oc-1', lugar: 'Aula 2' };
export const filtrosEventoDtoMock: filtrosEventoDto = { page: 1, categoria: 'Académico' };

