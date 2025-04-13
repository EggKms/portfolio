/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // UserService 주입
    private readonly configService: ConfigService, // ConfigService 주입
  ) {}

  // 유저 검증 로직
  async validateUser(username: string, password: string): Promise<any> {
    // const user = await this.userService.getUserById(username);
    // 실제 유저 검증 로직 (DB 조회 등)
    if (username === 'test' && password === 'password') {
      return { userId: 1, username: 'test' };
    }
    return "null";
  }

  // 로그인 시 access_token 및 refresh_token 발급
  async makeToken(user: any) {
    const payload = { userEmail: user.email, userId: user.userId };
    
    // const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });
    ;
    const accessToken = this.jwtService.sign(payload, { expiresIn: this.configService.get<string>('jwt.accessSignOptions.expiresIn') });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.configService.get<string>('jwt.refreshSignOptions.expiresIn') });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // refresh_token을 사용해 새로운 access_token 발급
  async refreshToken(refreshToken: string) {
    this.logger.debug(`Received refresh token: ${refreshToken}`);
    try {
      const decoded = this.jwtService.verify(refreshToken); // Refresh Token 검증
      this.logger.debug('Decoded refresh token:', decoded);

      // DB에서 refreshToken 검증
      const isValid = await this.userService.validateRefreshToken(decoded.userId, refreshToken);
      if (!isValid) {
        throw new Error('Invalid refresh token');
      }

      // 새로운 accessToken 생성
      const payload = { userEmail: decoded.userEmail, userId: decoded.userId };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      return { access_token: newAccessToken };
    } catch (error) {
      this.logger.error('Failed to refresh access token:', error.message);
      this.logger.error('Invalid refresh token:', error.message);
      throw error;
    }
  }

  decodeTokenToId(token: string) {
    const decoded = this.jwtService.decode(token); // JWT payload 디코딩
    const userId = decoded?.userId as string; // 사용자 ID 추출
    return userId;
  }
}
