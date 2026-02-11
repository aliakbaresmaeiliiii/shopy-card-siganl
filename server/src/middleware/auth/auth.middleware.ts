import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Middleware logic can be added here
    console.log('AuthMiddleware executed', req.path);
    next();
  }
}
