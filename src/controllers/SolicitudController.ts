import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, Inject, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import type { ISolicitudService } from '../interfaces/ISolicitudService';
import type { CrearSolicitudDTO, ModificarSolicitudDTO, AceptarSolicitudDTO, RechazarSolicitudDTO, FiltrosSolicitudDTO } from '../DTO/SolicitudDTO';

@Controller('api/solicitudes')
export class SolicitudController {
    constructor(
        @Inject('ISolicitudService') private readonly solicitudService: ISolicitudService
    ) { }

    // GET /api/solicitudes?estado=pendiente&page=1
    @Get()
    async listar(@Query() filtros: FiltrosSolicitudDTO, @Query('page') page?: number) {
        const solicitudes = await this.solicitudService.listar(filtros, page ? Number(page) : 1);
        return solicitudes.map(s => s.toJSON());
    }

    // GET /api/solicitudes/mis?page=1
    @Get('mis')
    async listarMias(@Query('page') page?: number) {
        const solicitudes = await this.solicitudService.listarMias(page ? Number(page) : 1);
        return solicitudes.map(s => s.toJSON());
    }

    // GET /api/solicitudes/:id
    @Get(':id')
    async obtenerPorId(@Param('id') id: string) {
        const solicitud = await this.solicitudService.obtenerPorId(id);
        if (!solicitud) throw new NotFoundException(`Solicitud con ID ${id} no encontrada.`);
        return solicitud.toJSON();
    }

    // POST /api/solicitudes
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async crear(@Body() dto: CrearSolicitudDTO) {
        const solicitud = await this.solicitudService.crear(dto);
        return solicitud.toJSON();
    }

    // PUT /api/solicitudes/:id
    @Put(':id')
    async modificar(@Param('id') id: string, @Body() dto: ModificarSolicitudDTO) {
        return await this.solicitudService.modificar(id, dto);
    }

    // DELETE /api/solicitudes/:id  → cancela (cambia estado a "cancelada")
    @Delete(':id')
    async cancelar(@Param('id') id: string) {
        return await this.solicitudService.cancelar(id);
    }

    // PATCH /api/solicitudes/:id/aceptar
    @Patch(':id/aceptar')
    async aceptar(@Param('id') id: string, @Body() dto: AceptarSolicitudDTO) {
        return await this.solicitudService.aceptar(id, dto);
    }

    // PATCH /api/solicitudes/:id/rechazar
    @Patch(':id/rechazar')
    async rechazar(@Param('id') id: string, @Body() dto?: RechazarSolicitudDTO) {
        return await this.solicitudService.rechazar(id, dto);
    }
}
