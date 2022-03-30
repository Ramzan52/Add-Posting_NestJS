import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async changePassword(
    username: string,
    password: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findOne({ username });

    const { salt, hash } = user;
    const pwdHash = hashSync(password, salt);

    if (hash !== pwdHash) {
      throw new UnauthorizedException();
    }

    user.hash = hashSync(newPassword, salt);
    await this.userModel.replaceOne({ _id: user._id }, user);
  }

  async create(dto: RegisterDto) {
    const exists = this.findOne(dto.username);
    if (exists) {
      throw new BadRequestException('Email is already registered');
    }

    const salt = await genSalt(10);
    const hash = hashSync(dto.password, salt);

    const user = await this.userModel.create({
      username: dto.username,
      name: dto.name,
      salt,
      hash,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async findOne(username: string) {
    return await this.userModel.findOne({ username });
  }
}
