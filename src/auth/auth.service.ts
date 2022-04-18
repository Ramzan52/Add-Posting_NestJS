import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcryptjs';
import { auth } from 'firebase-admin';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  getAuth = auth;
  constructor(
    private readonly jwtSvc: JwtService,
    private readonly usersSvc: UsersService,
    private readonly busSvc: AzureServiceBusService,
  ) {}

  async login(user: LoginDto) {
    const existingUser = await this.usersSvc.findOne(user.username);

    if (!existingUser.isUserVerified) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const emailBody = {
        recipient: [user.username],
        subject: 'Verification Code for Scrap Ready Application',
        from: 'scrapreadyapp@gmail.com',
        body: `Your code is ${code}`,
      };

      this.busSvc.sendEmail(emailBody);
      existingUser.registerCode = code;
      await this.usersSvc.update(existingUser);

      return {
        isVerified: false,
        message: 'Please verify your email',
      };
    }

    if (existingUser) {
      const payload = {
        sub: existingUser.id,
        name: existingUser.name,
        username: existingUser.username,
      };

      console.log('payload', payload);

      return {
        access_token: this.jwtSvc.sign(payload, { expiresIn: '24h' }),
        refresh_token: this.jwtSvc.sign(payload, { expiresIn: '24h' }),
        user: existingUser,
      };
    } else {
      throw new BadRequestException('User not found');
    }
  }

  async refreshToken(token: string) {
    try {
      var decodedToken = await this.jwtSvc.verifyAsync(token);
      const user = await this.usersSvc.findOne(decodedToken.username);
      if (user === null) {
        return null;
      }
      const payload = {
        sub: user.id,
        name: user.name,
        username: user.username,
      };
      return {
        access_token: this.jwtSvc.sign(payload, { expiresIn: '30m' }),
        refresh_token: this.jwtSvc.sign(payload, { expiresIn: '24h' }),
      };
    } catch (e) {
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersSvc.findOne(username);

    if (user === null) {
      return null;
    }

    const pwdHash = hashSync(password, user.salt);

    if (user.hash !== pwdHash) {
      return null;
    }

    const { _id, name, username: usr } = user;
    return { id: _id, name, username: usr };
  }
}
