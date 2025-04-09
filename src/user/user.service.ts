import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUserDto } from './dto/sign-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CustomLogger } from 'src/common/custom-logger';
@Injectable()
export class UserService {
  private readonly logger = new CustomLogger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 계정 생성
  async create(userDto: SignUserDto): Promise<string> {
    const user = new User();
    user.userId = userDto.id;
    user.email = userDto.email;
    user.password = userDto.password;
    user.refreshToken = userDto.refreshToken;
    user.refreshTokenExpiresAt = userDto.refreshTokenExpiresAt;
    await this.userRepository.save(user);
    return 'sucess';
  }

  // 계정 로그인
  async login(userDto: LoginUserDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { userId: userDto.id, password: userDto.password },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async updateUser(userDto: Partial<User>) {
    await this.userRepository.update(userDto.id, userDto);
  }

  // email로 사용자 찾기
  async findUserByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    this.logger.debug(`User found: ${user?.email}`);
    if (!user) {
      return false;
    }
    return true;
  }

  // id로 사용자 찾기
  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    this.logger.debug(`[UserService] User found: ${user?.userId}`);
    if (!user) {
      return false;
    }
    return true;
  }

  // 모든 사용자 정보 리턴
  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      return null;
    }
    return user;
  }

  // refreshToken 저장
  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (user) {
      user.refreshToken = refreshToken;
      user.refreshTokenExpiresAt = expiresAt; // 만료 시간 저장
      await this.userRepository.save(user);
    }
  }

  // refreshToken 검증
  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (user && user.refreshToken && user.refreshTokenExpiresAt) {
      // 암호화 추후진행
      // const decryptedToken = decrypt(user.refreshToken);
      const isTokenValid = user.refreshToken === refreshToken;
      const isNotExpired = user.refreshTokenExpiresAt > new Date();
      return isTokenValid && isNotExpired;
    }
    return false;
  }

  // 로그아웃 관련 로직은 현재 필요 없음
}
