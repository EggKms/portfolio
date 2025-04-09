import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import path, { join } from 'path';
import { Logger } from '@nestjs/common';
import { handlebars } from 'hbs';
import fs from 'fs';
import { UnauthorizedExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('hbs');

  // Handlebars partials 디렉토리 설정
  const partialsDir = path.resolve(__dirname, '..', 'src', 'views', 'partials');
  fs.readdirSync(partialsDir).forEach((file) => {
    const matches = /^([^.]+).hbs$/.exec(file);
    if (!matches) {
      return;
    }
    const name = matches[1];
    const template = fs.readFileSync(path.join(partialsDir, file), 'utf-8');
    handlebars.registerPartial(name, handlebars.compile(template));
  });

  // 커스텀 예외 필터 등록
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  const port = process.env.PORT ?? 3000;
  Logger.debug(`process.env.PORT: ${process.env.PORT}`, 'Bootstrap');
  Logger.debug(`Starting server on http://localhost:${port}`, 'Bootstrap');
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
