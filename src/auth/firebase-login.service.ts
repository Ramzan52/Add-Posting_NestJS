import { Profile } from 'src/profile/schemas/profile.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { auth } from 'firebase-admin';
import { ProfileService } from 'src/profile/profile.service';
import { UsersService } from 'src/users/users.service';

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
      const email = user.email;

      const existingUser = await this.usersSvc.findOne(email);
      const existingProfile = await this.profileSvc.findOne(email);

      if (existingUser !== null) {
        const payload = {
          sub: existingUser._id,
          name: existingUser.name,
          username: existingUser.username,
        };

        return {
          access_token: this.jwtSvc.sign(payload, { expiresIn: '30m' }),
          refresh_token: this.jwtSvc.sign(payload, { expiresIn: '24h' }),
          profile: existingProfile,
        };
      } else {
        const payload = {
          sub: user.user_id,
          name: user.name,
          username: user.email,
        };

        const createdUser = await this.usersSvc.create({
          username: user.email,
          name: user.name,
          password: '',
          phoneNumber: '',
        });

        const createdProfile = await this.profileSvc.create(
          {
            username: user.email,
            name: user.name,
            password: '',
            phoneNumber: '',
          },
          createdUser.id,
        );

        return {
          access_token: this.jwtSvc.sign(payload, { expiresIn: '24h' }),
          refresh_token: this.jwtSvc.sign(payload, { expiresIn: '24h' }),
          profile: createdProfile,
        };
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
