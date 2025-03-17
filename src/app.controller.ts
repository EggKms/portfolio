import { Controller, Get, Logger, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  @Render('index')
  getHello(@Req() req: Request): void {
    const clientIp = req.ip;
    const userAgent = req.headers['user-agent'];
    this.logger.log(
      `Rendering index.hbs for IP: ${clientIp}, User Agent: ${userAgent}`,
    );
  }
}
