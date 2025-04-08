import { Controller, Get, Post, Render, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUserDto } from './dto/sign-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('sign')
  @Render('sign')
  showSignPage() {
    return;
  }

  @Post('sign')
  async sign(
    @Body()
    signData: {
      sign_id: string;
      sign_email: string;
      sign_password: string;
    },
  ) {
    const SignUserDto: SignUserDto = {
      id: signData.sign_id,
      email: signData.sign_email,
      password: signData.sign_password,
    };
    // const createUserDto = decryptData(encryptedData, 'your-encryption-key'); // 데이터 복호화
    // 기존 사용자 있는지 검증식
    if (await this.userService.findUserByEmail(SignUserDto.email)) {
      return { status: 'error', message: '이미 가입된 이메일일입니다.' };
    }
    // 사용자 생성
    await this.userService.create(SignUserDto);
    const access_token = await this.authService.login({
      userId: SignUserDto.id,
      password: SignUserDto.password,
    });
    // 로그인 검증식
    return {
      status: 'success',
      message: '가입이 완료되었습니다.',
      access_token: access_token,
    };
  }

  @Get('login')
  @Render('login')
  showLoginPage() {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() loginData: { login_id: string; login_password: string }) {
    const loginUserDto: LoginUserDto = {
      id: loginData.login_id,
      password: loginData.login_password,
    };
    return this.userService.login(loginUserDto);
  }

  findEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }

  findId(id: string) {
    return this.userService.findUserById(id);
  }
}
