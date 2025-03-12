import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { ConfigService } from '@nestjs/config';

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'DATABASE_HOST':
                  return 'localhost';
                case 'DATABASE_PORT':
                  return 5432;
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
