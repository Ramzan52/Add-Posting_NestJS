import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import service from './auth/config/firebase-auth';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    admin.initializeApp({
      credential: admin.credential.cert(service),
    });
    app.enableCors({
      origin: 'http://localhost:5100',
    });

    app.useGlobalPipes(new ValidationPipe());
    const port = process.env.PORT;

    configureSwagger(app);

    await app.listen(port);
  } catch (err) {
    console.log('Error starting the application', err);
  }
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Scrap Ready API')
    .setDescription('Scrap Ready API')
    .setVersion('1.0')
    .addTag('scrap-ready')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
