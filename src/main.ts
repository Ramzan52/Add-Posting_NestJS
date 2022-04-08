import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import service from './auth/config/firebase-auth';

async function bootstrap() {
  try {
    console.log('NODE_ENV', process.env.NODE_ENV);
    console.log('HOST', process.env.HOST);
    console.log('PORT', process.env.PORT);
    console.log('MONGO_CONNECTION_STRING', process.env.MONGO_CONNECTION_STRING);

    const app = await NestFactory.create(AppModule);
    admin.initializeApp({
      credential: admin.credential.cert(service),
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
