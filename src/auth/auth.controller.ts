import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body, @Res() res) {
    try {
      await this.authService.signUp(body);
      return res.status(HttpStatus.OK).send('User registered, check you email');

    } catch (error) {
      console.error(error);

      return res
        .status(HttpStatus.BAD_GATEWAY)
        .send('Auth service unavailable');
    }
  }
}
