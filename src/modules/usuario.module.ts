import { Module } from '@nestjs/common';
import { UsuarioController } from '../controllers/UsuarioController';
import { UsuarioService } from '../services/UsuarioService';
import { UsuarioClient } from '../client/UsuarioClient';

@Module({
  controllers: [UsuarioController],
  providers: [{
      provide: 'IUsuarioService', 
      useClass: UsuarioService,   
    },{
      provide: 'IUsuarioClient', 
      useClass: UsuarioClient,   
    }],
})
export class UsuariosModule {}