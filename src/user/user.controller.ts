import {
  Controller,
  Get,
  Post,
  Render,
  Body,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { SignUserDto } from './dto/sign-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CustomLogger } from 'src/common/custom-logger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  private readonly logger = new CustomLogger(UserController.name);
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
    @Res() res: Response,
  ) {
    // const createUserDto = decryptData(encryptedData, 'your-encryption-key'); // 데이터 복호화
    // 기존 사용자 있는지 검증식
    if (await this.userService.findUserByEmail(signData.sign_email)) {
      return res.json({
        status: 'error',
        message: '이미 가입된 이메일일입니다.',
      });
    }
    const token = await this.authService.makeToken({
      userId: signData.sign_id,
      password: signData.sign_email,
    });
    this.logger.debug('access token : ' + token.access_token);
    this.logger.debug('refresh token : ' + token.refresh_token);

    const SignUserDto: SignUserDto = {
      id: signData.sign_id,
      email: signData.sign_email,
      password: signData.sign_password,
      refreshToken: token.refresh_token,
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 만료
    };

    // 사용자 생성
    await this.userService.create(SignUserDto);

    // HTTP-Only 쿠키 설정
    res.cookie('authToken', token.access_token, {
      httpOnly: true,
      secure: false, // HTTPS에서만 전송
      sameSite: 'strict', // CSRF 방지
      maxAge: 7 * 24 * 60 * 60 * 1000, // 15분 만료
    });

    // 로그인 검증식
    return res.json({
      status: 'success',
      message: '가입이 완료되었습니다.',
    });
  }

  @Get('login')
  @Render('login')
  showLoginPage() {
    return;
  }

  @Post('login')
  async login(
    @Body() loginData: { login_id: string; login_password: string },
    @Res() res: Response,
  ) {
    const loginUserDto: LoginUserDto = {
      id: loginData.login_id,
      password: loginData.login_password,
    };
    const user = await this.userService.login(loginUserDto);

    if (user) {
      this.logger.debug(`User found: ${user.userId}`);

      // JWT 토큰 생성
      const token = await this.authService.makeToken({
        userId: user.userId,
        password: user.password,
      });

      this.logger.debug('access token : ' + token.access_token);
      this.logger.debug('refresh token : ' + token.refresh_token);

      // Refresh Token을 DB에 업데이트
      await this.userService.saveRefreshToken(
        user.userId,
        token.refresh_token,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 만료
      );

      // HTTP-Only 쿠키 설정 (access_token)
      res.cookie('authToken', token.access_token, {
        httpOnly: true,
        secure: false, // HTTPS에서만 전송
        sameSite: 'strict', // CSRF 방지
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 만료
      });

      return res.json({
        status: 'success',
        message: '로그인에 성공했습니다.',
      });
    } else {
      return res.json({
        status: 'error',
        message: '로그인에 실패했습니다.',
      });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    // HTTP-Only 쿠키 삭제
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: false, // HTTPS에서만 전송
      sameSite: 'strict',
    });

    return res.json({
      status: 'success',
      message: '로그아웃이 완료되었습니다.',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  getStatus(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    this.logger.debug(`User status check : ${req.user}`);
    const user = req.user; // JwtAuthGuard를 통해 인증된 사용자 정보 가져오기
    if (user) {
      return res.json({
        status: 'success',
        authenticated: true,
        user: {
          userId: (user as { userId: string })?.userId, // 사용자 이름
          email: (user as { email: string })?.email, // 사용자 이메일
        },
      });
    }
    return res.json({
      status: 'success',
      authenticated: false,
    });
  }

  @Post('refresh')
  async refreshAccessToken(@Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = res.req.cookies['refreshToken']; // 쿠키에서 refreshToken 확인

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is missing.',
      });
    }
    const userId = (res.req.user as { id: string })?.id; // res에서 유저 정보를 가져와 id를 사용
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'User ID is missing.',
      });
    }
    const isValid = await this.userService.validateRefreshToken(
      userId,
      refreshToken,
    );
    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired refresh token.',
      });
    }

    // 새로운 access_token 생성
    const newAccessToken = await this.authService.refreshToken(refreshToken);

    // HTTP-Only 쿠키로 새로운 access_token 설정
    res.cookie('authToken', newAccessToken, {
      httpOnly: true,
      secure: false, // HTTPS에서만 전송
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      status: 'success',
      message: 'Access token refreshed successfully.',
    });
  }

  findEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }

  findId(id: string) {
    return this.userService.findUserById(id);
  }
}
