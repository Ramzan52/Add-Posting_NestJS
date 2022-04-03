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
      const decodedToken = await this.getAuth().verifyIdToken(token);

      const user = decodedToken;
      console.log(user);
      const existingUser = await this.usersSvc.findOne(decodedToken.user_id);
      if (existingUser) {
        const payload = {
          sub: user.user_id,
          name: user.name,
        };

        return {
          access_token: this.jwtSvc.sign(payload),
        };
      } else {
        this.usersSvc.create({
          username: user.name,
          name: user.name,
          password: '',
        });
        this.profileSvc.create({
          username: user.name,
          name: user.name,
          password: '',
        });
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
