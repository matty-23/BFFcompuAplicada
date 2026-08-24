import { Module } from '@nestjs/common';
import { SolicitudController } from '../controllers/SolicitudController';
import { SolicitudService } from '../services/SolicitudService';
// Eve: Importar SolicitudClient cuando lo crees inyectalo como 'ISolicitudClient'

@Module({
    controllers: [SolicitudController],
    providers: [
        // Eve: Cuando SolicitudClient esté listo, agrégalo aquí:
        {
            provide: 'ISolicitudService',
            useClass: SolicitudService,
        },
    ],
    exports: ['ISolicitudService'],
})
export class SolicitudModule { }
