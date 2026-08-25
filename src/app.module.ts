import { Module } from '@nestjs/common';
import { UsuariosModule } from './modules/UsuarioModule'; // Ajustá la ruta según tus carpetas
import { ConfigModule } from '@nestjs/config';
import { EventoModule } from './modules/EventoModule';
import { AuthModule } from './modules/AuthModule';
import {CorreoModule} from "./modules/CorreoModule"

@Module({
  imports: [UsuariosModule, EventoModule, AuthModule,CorreoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
