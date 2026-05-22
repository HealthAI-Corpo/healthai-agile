import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  app.enableCors({ credentials: true });

  const swagger = new DocumentBuilder()
    .setTitle('HealthAI API')
    .setVersion('0.1.0')
    .setDescription('Sprint 1 — Auth')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 API  → http://localhost:${port}/api/v1`);
  console.log(`📖 Docs → http://localhost:${port}/api/docs`);
}

bootstrap();
