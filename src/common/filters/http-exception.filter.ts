/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLogger } from '../custom-logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    // 로그 기록
    this.logger.error(`HTTP Exception: ${message}`);
    this.logger.error(`Status Code: ${status}`);

    // SQL Injection 보안 오류 처리
    if (
      exception instanceof BadRequestException &&
      message.includes('SQL Injection')
    ) {
      response.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Potential SQL Injection detected. Request denied.',
      });
      return;
    }

    // 기본 UnauthorizedException 처리
    if (exception instanceof UnauthorizedException) {
      // 로그아웃 처리 (쿠키 삭제)
      response.clearCookie('authToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });
      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });
      this.logger.error('Unauthorized access attempt detected.');
      response.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Unauthorized. Please log in again.',
      });
      return;
    }

    // 기타 예외 처리
    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: message,
    });
  }
}
