import { Module } from '@nestjs/common';
import { UsuariosModule } from './modules/usuario.module';
import { ConfigModule } from '@nestjs/config';
import { EventoModule } from './modules/EventoModule';
import { AuthModule } from './modules/AuthModule';
import { SolicitudModule } from './modules/SolicitudModule';
import { CorreoModule } from './modules/CorreoModule';

@Module({
  imports: [
    UsuariosModule,
    EventoModule,
    AuthModule,
    SolicitudModule,
    CorreoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
