import { Module } from '@nestjs/common';
import { UsuariosModule } from './modules/usuario.module'; // Ajustá la ruta según tus carpetas

@Module({
  imports: [UsuariosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}