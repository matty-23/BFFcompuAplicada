import { Module } from '@nestjs/common';
import { CorreoController } from '../controllers/CorreoController';
import { CorreoService } from '../services/CorreoService';
import { CorreoClient } from '../client/CorreoClient';

@Module({
    controllers: [CorreoController],
    providers: [{
      provide: 'ICorreoService', 
      useClass: CorreoService,   
    },{
      provide: 'ICorreoClient', 
      useClass: CorreoClient,   
    }],
})
export class CorreoModule { }