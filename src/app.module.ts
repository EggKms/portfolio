import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';
import { BoardModule } from './board/board.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    BoardModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'public'),
    }),
  ],
  controllers: [AppController, BoardController],
  providers: [AppService, BoardService],
})
export class AppModule {}
