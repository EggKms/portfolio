import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';
import { BoardModule } from './board/board.module';
import { HeaderController } from './header/header.controller';
import { HeaderService } from './header/header.service';
import { HeaderModule } from './header/header.module';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import configuration from './config/configuration';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('db.mariadb.url'),
        port: configService.get<number>('db.mariadb.port'),
        username: configService.get<string>('db.mariadb.username'),
        password: configService.get<string>('db.mariadb.password'),
        database: configService.get<string>('db.mariadb.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    BoardModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist', 'public'), // 기본 nest 동작
      // rootPath: join(__dirname, '..', 'dist', 'src', 'public'), // webPack nest 동작
    }),
    HeaderModule,
    UserModule,
  ],
  controllers: [AppController, BoardController, HeaderController],
  providers: [AppService, BoardService, HeaderService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
