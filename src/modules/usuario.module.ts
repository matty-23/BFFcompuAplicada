import { Module } from '@nestjs/common';
import { UsuariosController } from '../controller/UsuarioController';
import { UsuariosService } from '../service/UsuarioService';
import { CoreClient } from '../client/CoreClient';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, CoreClient],
})
export class UsuariosModule {}