import { Controller, Get, Logger, Query } from '@nestjs/common';

@Controller('board')
export class BoardController {
  @Get()
  test(): string {
    Logger.log('BoardController');
    return 'This action returns all boards';
  }
  @Get()
  queryTest(@Query('age') age: number, @Query('breed') breed: string) {
    return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
  }
}
