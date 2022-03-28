import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigReader } from 'neconfig';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:5100',
    });

    app.useGlobalPipes(new ValidationPipe());
    const config = app.get(ConfigReader);
    const port = config.getIntOrThrow('PORT');
    await app.listen(port);
  } catch (err) {
    console.log('Error starting the application', err);
  }
}

bootstrap();
