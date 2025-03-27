import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const user = new User();
    user.userId = createUserDto.sign_id;
    user.email = createUserDto.sign_email;
    user.password = createUserDto.sign_password;
    await this.userRepository.save(user);
    return 'sucess';
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email, password: loginUserDto.password },
    });
    if (user) {
      return 'Login successful';
    } else {
      return 'Invalid credentials';
    }
  }

  async findOne(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    return true;
  }
}
