import { Controller, Get, Post, Render, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('sign')
  @Render('sign')
  showSignPage() {
    return;
  }

  @Post('sign')
  async sign(@Body() createUserDto: CreateUserDto) {
    // const createUserDto = decryptData(encryptedData, 'your-encryption-key'); // 데이터 복호화
    // 기존 사용자 있는지 검증식
    if (await this.userService.findOne(createUserDto.sign_email)) {
      return { status: 'error', message: '이미 가입된 사용자입니다.' };
    }
    // 사용자 생성
    await this.userService.create(createUserDto);
    return { status: 'success', message: '가입이 완료되었습니다.' };
  }

  @Get('login')
  @Render('login')
  showLoginPage() {
    return;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  findOne(email: string) {
    return this.userService.findOne(email);
  }
}
