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
    user.userId = createUserDto.id;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
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
}
