import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LogInUserDto } from './dto/log-in.dto';

import { Response } from '../Types/Response';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/auth')
  register(@Body() body: CreateUserDto): Promise<Response> {
    return this.userService.register(body);
  }
  @Post('/auth/log-in')
  logIn(@Body() body: LogInUserDto): Promise<Response> {
    return this.userService.logIn(body);
  }

  @Get('user')
  getUsers(): Promise<Response> {
    return this.userService.findAll();
  }
}
