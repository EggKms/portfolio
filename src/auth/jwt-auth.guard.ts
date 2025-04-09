/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CustomLogger } from 'src/common/custom-logger';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new CustomLogger(JwtAuthGuard.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      // 기본 인증 로직 실행
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      this.logger.error(`Authentication error: ${error.name}`);
      this.logger.error(`Authentication error: ${error.message}`);

      // TokenExpiredError 감지 및 처리
      if (
        error instanceof TokenExpiredError ||
        error.message === 'jwt expired'
      ) {
        this.logger.warn('Access token expired. Attempting to refresh token.');

        const refreshToken = request.cookies['refreshToken'];
        if (!refreshToken) {
          this.logger.error('Refresh token is missing.');
          throw new UnauthorizedException('Refresh token is missing.');
        }

        try {
          // Refresh Token을 사용해 새로운 Access Token 발급
          const newAccessToken =
            await this.authService.refreshToken(refreshToken);
          response.cookie('authToken', newAccessToken.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15분 만료
          });

          this.logger.log('Access token refreshed successfully.');
          return true;
        } catch (refreshError) {
          this.logger.error(
            `Failed to refresh access token: ${refreshError.message}`,
          );
          throw new UnauthorizedException('Failed to refresh access token.');
        }
      }

      // 다른 인증 실패 처리
      throw new UnauthorizedException('Authentication failed.');
    }
  }
}
