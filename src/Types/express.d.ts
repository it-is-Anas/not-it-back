import * as express from 'express';
import { User } from '../user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property
    }
  }
}
