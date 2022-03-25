import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './auth-guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  // @Post('register')
  // register(@Body() body: RegisterDto) {
  //   this.authSvc.register(body);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authSvc.login(req.user);
  }

  // @Post('login')
  // login(@Body() body: LoginDto, @Res() response) {
  //   this.authSvc.login(body.username, body.password);

  //   return response.status(200).send();
  // }
}
