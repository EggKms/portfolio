import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CustomLogger } from 'src/common/custom-logger';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new CustomLogger(JwtAuthGuard.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    this.logger.debug('canActivate called in JwtAuthGuard');
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      // 기본 인증 로직 실행
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      this.logger.error(`Authentication error: ${error.name}`);
      this.logger.error(`Authentication error: ${error.message}`);

      // UnauthorizedException 먼저 처리
      if (error instanceof UnauthorizedException) {
        this.logger.warn('UnauthorizedException detected.');
        // 여기서 refreshToken 로직 처리 후 아닌건 다시 unauthorized 처리
        const cookieHeader = request?.headers?.cookie;
        if (!cookieHeader) {
          this.logger.debug('No cookies found in request headers.');
          return false;
        }

        // 쿠키 문자열에서 authToken 추출
        const cookies = cookieHeader.split(';').reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

        //request에서 user 정보 추출
        const userId = this.authService.decodeTokenToId(cookies['authToken']);

        // userId로 refreshToken 가져오기
        const user = await this.userService.getUserById(userId);
        if (!user) {
          this.logger.warn('User not found for refresh token.');
          return false;
        }
        const refreshToken = user.refreshToken;
        // Refresh Token을 사용해 새로운 Access Token 발급
        try {
          const newAccessToken =
            await this.authService.refreshToken(refreshToken);
          response.cookie('authToken', newAccessToken.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 15분 만료
          });
          this.logger.log('Access token refreshed successfully.');
          // 사용자 정보를 request.user에 저장
          request.user = {
            userId: user.userId,
            email: user.email,
          };
          return true;
        } catch (err) {
          this.logger.error('Failed to refresh access token:', err.name);
          this.logger.error('Invalid refresh token:', err.message);
          throw new UnauthorizedException(
            'Failed to refresh access token. Invalid refresh token.',
          );
        }
      }
      throw new UnauthorizedException('Invalid or missing token.');
    }
  }
}
