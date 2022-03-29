import { FireBaseLoginService } from './firebase-login.service';
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Request,
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
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  db: any;
  constructor(
    private readonly authSvc: AuthService,
    private readonly profileSvc: ProfileService,
    private readonly userSvc: UsersService,
    private readonly fireBaseSvc: FireBaseLoginService,
  ) {
    admin.initializeApp();
    this.db = admin.firestore();
  }

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
  async login(@Request() req) {
    return this.authSvc.login(req.user);
  }
  @Post('/fb-login/:token')
  async fbLogin(@Param() token: string) {
    return this.fireBaseSvc.fbLogin(token);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    await this.userSvc.create(body);
    return await this.profileSvc.create(body);
  }
}
