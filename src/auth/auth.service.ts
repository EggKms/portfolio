/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
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

  // 로그인시 access_token 발급
  async login(user: any) {
    const payload = { username: user.username, userId: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
