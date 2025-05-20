import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogInUserDto } from './dto/log-in.dto';

import { Response } from '../Types/Response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(body: CreateUserDto): Promise<Response> {
    const { firstName, lastName, email, password } = body;
    try{
      const checkEmail = await this.usersRepository.findOne({
        where: { email  },
      });
      if(!!checkEmail){
        return {
          message: 'Email is already exisit',
          status: 422,
        }
      }
    }catch(error){
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    if (!hashedPassword) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    const user = this.usersRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    const payload = { sub: user.id, email: user.email };
    let access_token;
    try {
      access_token = await this.jwtService.signAsync(payload);
    } catch (error) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    return {
      message: 'User register',
      data: user,
      status: 201,
      access_token,
    };
  }

  async logIn(body: LogInUserDto): Promise<Response> {
    let user;
    try {
      user = await this.usersRepository.findOne({
        where: { email: body.email },
      });
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    if (user) {
      let isMatch;
      try {
        isMatch = await bcrypt.compare(body.password, user?.password);
      } catch (err) {
        return {
          message: 'Somthing went wrong please try again later',
          status: 422,
        };
      }
      if (isMatch) {
        const payload = { sub: user.id, email: user.email };
        let access_token;
        try {
          access_token = await this.jwtService.signAsync(payload);
        } catch (err) {
          return {
            message: 'Somthing went wrong please try again later',
            status: 422,
          };
        }
        return {
          message: 'Welcome Back',
          data: user,
          status: 200,
          access_token,
        };
      }
      throw new HttpException(
        'EMAIL AND PASSWORD NOT MATCH',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    throw new HttpException('EMAIL NOT FOUND', HttpStatus.UNPROCESSABLE_ENTITY);
  }
  async findAll(): Promise<Response> {
    let users;
    try {
      users = await this.usersRepository.find();
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    return {
      data: users,
      message: 'All USERS',
      status: 200,
    };
  }
}
