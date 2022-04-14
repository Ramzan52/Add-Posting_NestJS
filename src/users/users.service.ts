import { VerifyResetPassword } from './../auth/dto/verify.resetPassword.dto';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ResetPassword } from 'src/auth/dto/reset.password';
import { VerifyDto } from 'src/auth/dto/verfiy.dto';
import { User, UserDocument } from './schemas/user.schema';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly busSvc: AzureServiceBusService,
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

  async create(dto: RegisterDto, code: number) {
    const exists = await this.findOne(dto.username);
    if (exists) {
      throw new BadRequestException('Email is already registered');
    }

    if (exists.phoneNumber == dto.phoneNumber) {
      throw new BadRequestException('Phone number is already registered');
    }

    const salt = await genSalt(10);
    const hash = hashSync(dto.password, salt);

    const user = await this.userModel.create({
      username: dto.username,
      name: dto.name,
      salt,
      hash,
      registerCode: code,
      isUserVerified: false,
      phoneNumber: dto.phoneNumber
    });

    return {
      username: user.username,
      name: user.name,
      id: user._id,
    };
  }

  async findOne(username: string) {
    return await this.userModel.findOne({ username });
  }

  async update(user: any, code: number) {
    let existUser = await this.userModel.findOne(user.username);
    existUser.registerCode = code;
    return await this.userModel.findOneAndReplace( { username: user.username}, user, {new: true});
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async verify(dto: VerifyDto) {
    var username = dto.username;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isUserVerified) {
      throw new BadRequestException('User already verified');
    }
    if (user.registerCode == dto.code) {
      return true;
    }
  }
  async resetPassword(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.IsResetVerified = false;
    const code = Math.floor(100000 + Math.random() * 900000);
    const emailBody = {
      recipient: [`${username}`],
      subject: 'Verification Code to reset password',
      from: 'scrap.ready@aquila360.com',
      body: `Your code is ${code}`,
    };

    this.busSvc.sendEmail(emailBody);
  }
  async verifyResetPassword(dto: VerifyResetPassword, username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isUserVerified) {
      throw new BadRequestException('User already verified');
    }
    if (user.registerCode == dto.code) {
      const { salt, hash } = user;
      user.hash = hashSync(dto.password, salt);
      user.isUserVerified = true;
      await this.userModel.replaceOne({ _id: user._id }, user);
    }
  }
}
