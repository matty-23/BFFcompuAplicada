import { Module } from '@nestjs/common';
import { SolicitudController } from '../controllers/SolicitudController';
import { SolicitudService } from '../services/SolicitudService';
import { SolicitudClient } from '../client/SolicitudClient';

@Module({
    controllers: [SolicitudController],
    providers: [
        SolicitudClient,
        {
            provide: 'ISolicitudClient',
            useClass: SolicitudClient,
        },
        {
            provide: 'ISolicitudService',
            useClass: SolicitudService,
        },
    ],
    exports: ['ISolicitudService'],
})
export class SolicitudModule { }
