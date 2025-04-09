/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // UserService 주입
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
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // refreshToken 암호화 및 DB 저장
    // TODO: 암호화 추후 진행
    // const encryptedToken = encrypt(refreshToken);
    // await this.userService.saveRefreshToken(user.userId, encryptedToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7일 만료
    

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // refresh_token을 사용해 새로운 access_token 발급
  async refreshToken(refreshToken: string) {
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
      throw new Error('Invalid refresh token: ' + error.message);
    }
  }
}
