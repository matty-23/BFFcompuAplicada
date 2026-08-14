import { Controller, Query, Get, Post, Put, Delete, Patch, Param, Body, Inject, NotFoundException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import type { IEventoService } from '../interfaces/IEventoService';
import { CrearEventoDTO, ActualizarEventoDTO, AsignarEncargadoDTO, ParticipantesDTO } from '../DTO/EventoDTO';
import { FiltrosEventoDto } from 'src/DTO/FiltrosDto';
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
    async busquedaBlanda(@Query() filtros: FiltrosEventoDto) {
        const eventos = await this.eventoService.filtrado(filtros);
        // Retornamos un objeto JSON
        return {
            ok: true,
            cantidad: eventos.length,
            data: eventos
        };
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
    async crear(@Body() dto: CrearEventoDTO) {
        const evento = await this.eventoService.crearEvento(dto);
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
    @Patch(':id/encargado')
    async asignarEncargado(@Param('id') id: string, @Body() dto: AsignarEncargadoDTO) {
        const evento = await this.eventoService.asignarEncargado(id, dto.usuarioId);
        if (!evento) throw new NotFoundException(`Evento con ID ${id} no encontrado.`);
        return evento.toJSON();
    }

    // PATCH /api/eventos/:id/participantes
    @Patch(':id/participantes')
    @HttpCode(HttpStatus.NO_CONTENT)
    async agregarParticipantes(@Param('id') id: string, @Body() dto: ParticipantesDTO) {
        await this.eventoService.agregarParticipantes(id, dto.participantes);
    }

    // DELETE /api/eventos/:id/participantes/:usuarioId
    @Delete(':id/participantes/:usuarioId')
    async borrarParticipante(@Param('id') id: string, @Param('usuarioId') usuarioId: string) {
        const evento = await this.eventoService.borrarParticipante(id, usuarioId);
        if (!evento) throw new NotFoundException(`Evento o participante no encontrado.`);
        return evento.toJSON();
    }

}
