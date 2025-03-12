import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoardService {
  constructor(private configService: ConfigService) {}

  test(): string {
    const host = this.configService.get<string>('http.host');
    return `This action returns a test board. Database host: ${host}`;
  }
}
