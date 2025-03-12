import { Controller, Get, Logger } from '@nestjs/common';

@Controller('board')
export class BoardController {
  @Get()
  findAll(): string {
    Logger.log('BoardController');
    return 'This action returns all boards';
  }
}
