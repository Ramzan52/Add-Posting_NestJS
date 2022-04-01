import { ProfileService } from 'src/profile/profile.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';

@Injectable()
export class FireBaseLoginService {
  getAuth = auth;
  constructor(
    private readonly jwtSvc: JwtService,
    private readonly usersSvc: UsersService,
    private readonly profileSvc: ProfileService,
  ) {}

  async fbLogin(token: any) {
    try {
      console.log('fbLogin');
      const decodedToken = await this.getAuth().verifyIdToken(token);
      console.log(decodedToken);

      const user = decodedToken;
      console.log(user);
      const email = user.email;

      const existingUser = await this.usersSvc.findOne(email);
      if (existingUser) {
        const payload = {
          sub: user.user_id,
          name: user.name,
          username: user.email,
        };

        return {
          access_token: this.jwtSvc.sign(payload),
        };
      } else {
        const payload = {
          sub: user.user_id,
          name: user.name,
          username: user.email,
        };
        await this.usersSvc.create({
          username: user.email,
          name: user.name,
          password: '',
        });
        await this.profileSvc.create({
          username: user.email,
          name: user.name,
          password: '',
        });
        return {
          access_token: this.jwtSvc.sign(payload),
        };
      }
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
