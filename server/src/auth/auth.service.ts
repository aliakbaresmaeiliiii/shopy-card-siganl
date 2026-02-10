import { UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './auth';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  users: UserDTO[] = [
    {
      id: 1,
      email: 'aliakbaresmaeili98@gmail.com',
      password: '12345',
    },
  ];

  async login(email: string, password: string) {
    // fake validation بدون دیتابیس
    if (email !== 'aliakbaresmaeili98@gmail.com' || password !== '123456') {
      throw new UnauthorizedException('Invalid credentials');
    }

    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

    return {
      accessToken: token,
      user: { email },
    };
  }

  getUserByEmail(email: string): UserDTO | undefined {
    return this.users.find((user) => user.email === email);
  }

  validateUser(email: string, password: string) {
    const user = this.getUserByEmail(email);
    return !!user && user.password === password;
  }

  createUser(user: UserDTO) {}
}
