import { Module } from '@nestjs/common';
import { EventoController } from '../controller/EventoController';
import { EventoService } from '../service/EventoService';
import { EventoClient } from '../client/EventoClient';

@Module({
    controllers: [EventoController],
    providers: [
        EventoClient,
        {
            provide: 'IEventoClient',
            useClass: EventoClient,
        },
        {
            provide: 'IEventoService',
            useClass: EventoService,
        },
    ],
    exports: ['IEventoService'],
})
export class EventoModule {}
