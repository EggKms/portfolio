import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('hbs');

  const port = process.env.PORT ?? 3000;
  Logger.debug(`process.env.PORT: ${process.env.PORT}`, 'Bootstrap');
  Logger.debug(`Starting server on http://localhost:${port}`, 'Bootstrap');
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
