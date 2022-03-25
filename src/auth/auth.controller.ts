import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    this.authSvc.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto, @Res() response) {
    this.authSvc.login(body.username, body.password);

    return response.status(200).send();
  }
}
