/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { CustomLogger } from 'src/common/custom-logger';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new CustomLogger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly userService: UserService, // UserService 주입
  ) {
    const secret = configService.get<string>('jwt.secret');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // Access Token을 request.headers.cookie에서 추출
          const cookieHeader = request?.headers?.cookie;
          if (!cookieHeader) {
            this.logger.debug('No cookies found in request headers.');
            return null;
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

          const token = cookies['authToken'];
          this.logger.debug(`Extracted token from cookies: ${token}`);
          return token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret as string,
    });
  }

  async validate(payload: any) {
    try {
      this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);

      // 유저 정보를 UserService에서 조회
      const user = await this.userService.getUserById(payload.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { userId: user.userId, email: user.email };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.logger.warn('Token has expired');
        throw new TokenExpiredError('TokenExpiredError', new Date());
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  // passport-jwt의 verify 콜백을 커스터마이징
  handleRequest(err, user, info) {
    if (info instanceof TokenExpiredError) {
      this.logger.warn('TokenExpiredError detected in handleRequest.');
      throw new UnauthorizedException('TokenExpiredError');
    }
    if (err || !user) {
      this.logger.error('Unauthorized access detected in handleRequest.');
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
