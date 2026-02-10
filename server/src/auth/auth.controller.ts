import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('/login')
  // getUser(@Body() user: UserDTO) {
  //   const isValid = this.service.validateUser(user.email, user.password);
  //   return {
  //     success: isValid,
  //   };
  // }

  // @Post('login')
  // login(@Body() body: { email: string; password: string }) {
  //   return this.authService.login(body.email, body.password);
  // }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    console.log('LOGIN HIT', body);
    return { accessToken: 'fake-token' };
  }

  @Post('register')
  register(@Body() user: UserDTO) {
    return this.authService.createUser(user);
  }
}
