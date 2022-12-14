import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import {
  createEmailBody,
  generateRandomSixDigitCode,
} from 'src/common/helper/email.helper';
import { ProfileService } from 'src/profile/profile.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard, LocalAuthGuard } from './auth-guards';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordBody } from './dto/resetPassword.dto';
import { UpdateResetPassword } from './dto/update.resetPassword.dto';
import { VerifyDto } from './dto/verify.dto';
import { VerifyResetPassword } from './dto/verify.resetPassword.dto';
import { FireBaseLoginService } from './firebase-login.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  db: any;
  constructor(
    private readonly authSvc: AuthService,
    private readonly profileSvc: ProfileService,
    private readonly userSvc: UsersService,
    private readonly fireBaseSvc: FireBaseLoginService,
    private readonly busSvc: AzureServiceBusService,
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
  async login(@Body() body: LoginDto) {
    return await this.authSvc.login(body);
  }

  @Post('/fb-login/:token')
  async fbLogin(@Param('token') token: string) {
    return this.fireBaseSvc.fbLogin(token);
  }

  @Post('refresh-token/:refresh')
  async refreshToken(@Param('refresh') refresh: string) {
    const response = this.authSvc.refreshToken(refresh);
    if (response != null) {
      return response;
    }
    throw new BadRequestException();
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.userSvc.create(body);
    return user;
  }

  @Post('verify-user/resend-code')
  async resendCode(@Query('email') email: string) {
    const user = await this.userSvc.findOne(email);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    if (user.isUserVerified) {
      throw new BadRequestException('User already verified');
    }

    const code = generateRandomSixDigitCode();
    const emailBody = createEmailBody(email, code);

    this.busSvc.sendEmail(emailBody);
    user.registerCode = code;
    await this.userSvc.update(user);
  }

  @Post('verify-user')
  async verifyUser(@Body() body: VerifyDto) {
    const isVerified = await this.userSvc.verify(body);
    if (isVerified) {
      const user = await this.userSvc.findOne(body.username);
      const regDto: RegisterDto = new RegisterDto();
      regDto.name = user.name;
      regDto.username = user.username;
      regDto.phoneNumber = user.phoneNumber;
      return await this.profileSvc.create(regDto, user._id);
    }

    throw new BadRequestException('Invalid OTP');
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordBody) {
    return await this.userSvc.resetPassword(dto.email);
  }

  @Post('reset-password/verify-otp')
  async VerifyResetPassword(@Body() body: VerifyResetPassword) {
    return await this.userSvc.verifyResetPassword(body, body.email);
  }

  @Post('reset-password/new')
  async UpdatePassword(@Body() body: UpdateResetPassword) {
    return await this.userSvc.updateResetPassword(body, body.email);
  }

  @Post('forgot-password/resend-code')
  async resendCodePassword(@Query('email') email: string) {
    console.log({ email });
    const user = await this.userSvc.findOne(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const code = generateRandomSixDigitCode();
    const emailBody = createEmailBody(email, code);

    this.busSvc.sendEmail(emailBody);
    user.resetPasswordCode = code;
    await this.userSvc.update(user);
  }
}
