import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

import * as Responses from '../Types/Response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.get('Authorization')?.split(' ')[1];
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        const id = payload.sub;
        const user = await this.usersRepository.findOne({ where: { id } });
        console.log(user);
        if (user) {
          req.user = user;
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        const resp: Responses.Response = {
          message: 'Invalid token PLEASE AUTH AGAIN',
          status: 401,
        };
        res.json(resp);
      }
      next();
    } else {
      const resp: Responses.Response = {
        message: 'NOT AUTH PLEASE AUTH AGAIN',
        status: 400,
      };
      res.json(resp);
    }
  }
}
