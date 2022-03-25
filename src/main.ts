import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigReader } from 'neconfig';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigReader);
  const port = config.getIntOrThrow('PORT');
  console.log(`Listening on http://localhost:${port}`);
  await app.listen(port);
}
bootstrap();
