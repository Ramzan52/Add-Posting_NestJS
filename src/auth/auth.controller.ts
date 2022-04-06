import { FireBaseLoginService } from './firebase-login.service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProfileService } from 'src/profile/profile.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard, LocalAuthGuard } from './auth-guards';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import admin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  db: any;
  constructor(
    private readonly authSvc: AuthService,
    private readonly profileSvc: ProfileService,
    private readonly userSvc: UsersService,
    private readonly fireBaseSvc: FireBaseLoginService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    await this.userSvc.changePassword(
      req.user.username,
      body.password,
      body.newPassword,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body: LoginDto) {
    return this.authSvc.login(body);
  }

  @Post('/fb-login/:token')
  async fbLogin(@Param('token') token: string) {
    return this.fireBaseSvc.fbLogin(token);
  }

  @Post('refresh-token/:refresh')
  async refreshToken(@Param('refresh') refresh: string) {
    var response = this.authSvc.refreshToken(refresh);
    if (response != null) return response;
    else throw new BadRequestException();
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    await this.userSvc.create(body);
    return await this.profileSvc.create(body);
  }
}
