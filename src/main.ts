import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS para que Next.js pueda consumir el BFF
    app.enableCors();

    // Validación automática de DTOs con class-validator
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    const PORT = process.env.PORT ?? 3001;
    await app.listen(PORT);
    console.log(`🚀 BFF corriendo en http://localhost:${PORT}`);
}

bootstrap();
