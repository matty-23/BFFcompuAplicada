import { Module } from '@nestjs/common';
import { EventoController } from '../controllers/EventoController';
import { EventoService } from '../services/EventoService';
import { EventoClient } from '../clients/EventoClient';

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
