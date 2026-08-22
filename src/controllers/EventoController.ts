import { Controller, Query, Get, Post, Put, Delete, Patch, Param, Body, Inject, NotFoundException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import type { IEventoService } from '../interfaces/IEventoService';
import { CrearEventoMultiDTO, ActualizarEventoDTO, AsignarEncargadoDTO, ParticipantesDTO } from '../DTO/EventoDTO';
import { filtrosEventoDto } from '../DTO/FiltrosDto';
@Controller('api/eventos')
export class EventoController {

    constructor(
        @Inject('IEventoService') private readonly eventoService: IEventoService
    ) { }

    // GET /api/eventos
    @Get()
    async getAll() {
        const eventos = await this.eventoService.getEventos();
        return eventos.map(e => e.toJSON());
    }

    @Get('filtros')
    async busquedaBlanda(@Query() filtros: filtrosEventoDto) {
        try {
            const eventos = await this.eventoService.filtrado(filtros);

            return {
                ok: true,
                cantidad: eventos.length,
                data: eventos
            };
        } catch (error) {
            return {
                ok: false,
                message: 'Error al realizar la búsqueda blanda',
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
    // GET /api/eventos/:id
    @Get(':id')
    async getById(@Param('id') id: string) {
        const evento = await this.eventoService.getEventoById(id);
        if (!evento) throw new NotFoundException(`Evento con ID ${id} no encontrado.`);
        return evento.toJSON();
    }

    // POST /api/eventos
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() dto: CrearEventoMultiDTO) {
        const evento = await this.eventoService.crearEventoMulti(dto);
        if (!evento) throw new BadRequestException('Error al crear el evento.');
        return evento.toJSON();
    }

    // PUT /api/eventos/:id
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async actualizar(@Param('id') id: string, @Body() dto: ActualizarEventoDTO) {
        await this.eventoService.actualizarEvento(id, dto);
    }

    // DELETE /api/eventos/:id
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async eliminar(@Param('id') id: string) {
        await this.eventoService.eliminarEvento([id]);
    }

    // PATCH /api/eventos/:id/encargado
    @Patch(':idEvento/ocurrencias/:idOcurrencia/encargado')
    async asignarEncargado(
        @Param('idEvento') idEvento: string,
        @Param('idOcurrencia') idOcurrencia: string,
        @Body() dto: AsignarEncargadoDTO
    ) {
        const evento = await this.eventoService.asignarEncargado(idEvento, idOcurrencia, dto.usuarioId);
        if (!evento) throw new NotFoundException(`Evento u ocurrencia no encontrados.`);
        return evento.toJSON();
    }

    // PATCH /api/eventos/ocurrencias/:idOcurrencia/participantes
    @Patch('ocurrencias/:idOcurrencia/participantes')
    @HttpCode(HttpStatus.NO_CONTENT)
    async agregarParticipantes(@Param('idOcurrencia') idOcurrencia: string, @Body() body: { participantes: string[] }) {
        await this.eventoService.agregarParticipantes(idOcurrencia, body.participantes);
    }

    // DELETE /api/eventos/ocurrencias/:idOcurrencia/participantes/:usuarioId
    @Delete('ocurrencias/:idOcurrencia/participantes/:usuarioId')
    async borrarParticipante(@Param('idOcurrencia') idOcurrencia: string, @Param('usuarioId') usuarioId: string) {
        await this.eventoService.borrarParticipante(idOcurrencia, usuarioId);
        return { ok: true };
    }

}
