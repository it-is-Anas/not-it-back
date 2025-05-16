import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async register(body: CreateUserDto) {
    const { firstName, lastName, email, password } = body;
    // bcrypt.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      msg: 'User register',
      user,
      status: 201,
      access_token,
    };
  }
}
