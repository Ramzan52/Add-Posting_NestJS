import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtSvc: JwtService,
    private readonly usersSvc: UsersService,
  ) {}

  async login(user: any) {
    const payload = {
      sub: user.id,
      name: user.name,
      username: user.username,
    };

    return {
      access_token: this.jwtSvc.sign(payload),
    };
  }

  async loginWithGoogle(payload: any) {
    console.log('loginWithGoogle', payload);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersSvc.findOne(username);

    if (user === null) {
      return null;
    }

    const pwdHash = bcrypt.hashSync(password, user.salt);

    if (user.hash !== pwdHash) {
      return null;
    }

    const { _id, name, username: usr } = user;
    return { id: _id, name, username: usr };
  }
}
