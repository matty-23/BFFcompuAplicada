import { Module } from '@nestjs/common';
import { UsuariosModule } from './modules/usuario.module'; // Ajustá la ruta según tus carpetas
import { ConfigModule } from '@nestjs/config';
import { EventoModule } from './modules/EventoModule';

@Module({
  imports: [UsuariosModule, EventoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
