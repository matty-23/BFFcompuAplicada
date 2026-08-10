import { Module } from '@nestjs/common';
import { EventoModule } from './modules/EventoModule';

@Module({
    imports: [EventoModule],
})
export class AppModule {}
