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
    return this.userService.create(createUserDto);
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
}
