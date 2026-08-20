import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { AuthClient } from '../client/AuthClient';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthClient],
})
export class UsuariosModule {}