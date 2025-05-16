import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LogInUserDto } from './dto/log-in.dto';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/auth')
  register(@Body() body: CreateUserDto): object {
    return this.userService.register(body);
  }
  @Post('/auth/log-in')
  logIn(@Body() body: LogInUserDto) {
    return this.userService.logIn(body);
  }

  @Get('user')
  getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
