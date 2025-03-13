import { Controller, Get, Logger, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  @Render('index')
  getHello(): void {
    this.logger.log('Rendering index.hbs');
  }
}
