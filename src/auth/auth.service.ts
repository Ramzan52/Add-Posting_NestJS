import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (user === null) {
      throw new UnauthorizedException();
    }

    const { salt } = user;
    const hash = bcrypt.hashSync(password, salt);

    if (hash !== user.hash) {
      throw new UnauthorizedException();
    }

    return { success: true };
  }

  async register(dto: RegisterDto) {
    const { username, name, password } = dto;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new this.userModel({
      username,
      name,
      salt,
      hash,
    });

    const result = await user.save();
    return result._id;
  }
}
