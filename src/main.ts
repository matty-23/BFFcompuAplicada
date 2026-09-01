import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para recibir peticiones y permitir envío/recepción de cookies
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 BFF escuchando en http://localhost:${port}`);
}

bootstrap();
