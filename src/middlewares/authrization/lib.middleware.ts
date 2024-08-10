import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UserRole } from 'src/database/models/user.model';

@Injectable()
export class LibMiddleware implements NestMiddleware {
  constructor() {}

  async use(req, res, next: NextFunction) {
    if (req.user.role == UserRole.SUPERADMIN) {
      next();
    }
    if (req.user.role != UserRole.LIB) {
      return res.status(403).json({ message: 'access denied' });
    }

    next();
  }
}
