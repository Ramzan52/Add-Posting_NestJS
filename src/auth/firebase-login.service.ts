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
    console.log(token);
    await this.getAuth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const user = JSON.parse(decodedToken.uid);
        const existingUser = this.usersSvc.findOne(user.username);
        if (existingUser) {
          const payload = {
            sub: user.id,
            name: user.name,
            username: user.username,
          };

          return {
            access_token: this.jwtSvc.sign(payload),
          };
        } else {
          this.usersSvc.create(user);
          this.profileSvc.create(user);
        }
      })
      .catch((error) => {
        throw new UnauthorizedException();
      });
  }
}
