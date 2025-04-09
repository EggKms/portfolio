/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLogger } from '../custom-logger';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger(UnauthorizedExceptionFilter.name);
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    this.logger.error('Unauthorized access attempt detected.');
    this.logger.error(`Exception message: ${exception.message}`);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 로그아웃 처리 (쿠키 삭제)
    // response.clearCookie('authToken', {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'strict',
    // });
    // response.clearCookie('refreshToken', {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'strict',
    // });

    // 홈으로 리다이렉트 또는 사용자 정의 응답
    response.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized. Please log in again.',
    });
  }
}
