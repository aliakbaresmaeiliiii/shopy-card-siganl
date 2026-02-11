import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // JWT middleware logic can be added here
    const authHearder = req.headers['authorization'];
    console.log('JwtMiddleware executed', req.path, authHearder);

    if (!authHearder) {
      throw new Error('No token provided');
    }

    const [type, token] = authHearder.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new Error('Invalid token format');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      (req as any).user = payload;
      next();
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
