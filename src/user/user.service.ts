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
    await this.userRepository.save(user);
    return 'sucess';
  }

  // 계정 로그인
  async login(userDto: LoginUserDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { userId: userDto.id, password: userDto.password },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
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
}
