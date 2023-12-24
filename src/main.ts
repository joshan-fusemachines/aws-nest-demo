import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app';
import { config } from './database';
import { setupSwagger } from './util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  const port = config.PORT;
  const mode = config.NODE_ENV || 'development';

  if (mode != 'production') {
    setupSwagger(app);
  }

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

void bootstrap();
