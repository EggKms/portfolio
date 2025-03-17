import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Request } from 'express';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should log client IP and user agent', () => {
      const req = {
        ip: '127.0.0.1',
        headers: {
          'user-agent': 'jest-test-agent',
        },
      } as Request;
      const logSpy = jest.spyOn(appController['logger'], 'log');
      appController.getHello(req);
      expect(logSpy).toHaveBeenCalledWith(
        'Rendering index.hbs for IP: 127.0.0.1, User Agent: jest-test-agent',
      );
    });
  });
});
