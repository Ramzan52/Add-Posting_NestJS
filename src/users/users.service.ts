import { VerifyResetPassword } from './../auth/dto/verify.resetPassword.dto';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hashSync } from 'bcryptjs';
import { Model, mongo } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { VerifyDto } from 'src/auth/dto/verify.dto';
import { User, UserDocument } from './schemas/user.schema';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { UpdateResetPassword } from 'src/auth/dto/update.resetPassword.dto';
import {
  createEmailBody,
  generateRandomSixDigitCode,
} from 'src/common/helper/email.helper';

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

  async create(dto: RegisterDto) {
    const exists = await this.findOne(dto.username);

    if (exists) {
      if (exists.username == dto.username) {
        throw new BadRequestException('Email is already registered');
      }
    }

    const phoneExists = await this.findByPhone(dto.phoneNumber);

    if (phoneExists) {
      if (phoneExists.phoneNumber == dto.phoneNumber) {
        throw new BadRequestException('Phone Number is already registered');
      }
    }

    const code = generateRandomSixDigitCode();
    const emailBody = createEmailBody(dto.username, code);

    console.log({ code });
    console.log({ emailBody });

    this.busSvc.sendEmail(emailBody);

    const salt = await genSalt(10);
    const hash = hashSync(dto.password, salt);

    const user = await this.userModel.create({
      username: dto.username,
      name: dto.name,
      salt,
      hash,
      registerCode: code,
      isUserVerified: false,
      phoneNumber: dto.phoneNumber,
    });

    return {
      username: user.username,
      name: user.name,
      id: user._id,
    };
  }

  async findOne(username: string) {
    return await this.userModel.findOne({ username: username }).exec();
  }

  async findByPhone(phoneNumber: string) {
    return await this.userModel.findOne({ phoneNumber: phoneNumber }).exec();
  }

  async update(user: any) {
    return await this.userModel.replaceOne(
      { _id: new mongo.ObjectId(user.id) },
      user,
    );
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async verify(dto: VerifyDto) {
    let username = dto.username;
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isUserVerified) {
      throw new BadRequestException('User already verified');
    }

    if (user.registerCode == dto.code) {
      user.isUserVerified = true;
      user.registerCode = 0;
      await this.userModel.replaceOne(
        { _id: new mongo.ObjectId(user.id) },
        user,
      );
      return true;
    }
    return false;
  }
  async resetPassword(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isResetVerified = false;
    const code = generateRandomSixDigitCode();
    const emailBody = createEmailBody(username, code);

    this.busSvc.sendEmail(emailBody);
    user.resetPasswordCode = code;
    user.isResetVerified = false;
    await this.userModel.replaceOne(
      { _id: new mongo.ObjectId(user._id) },
      user,
    );
  }

  async verifyResetPassword(dto: VerifyResetPassword, username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isResetVerified) {
      throw new BadRequestException('User already verified');
    }
    if (user.resetPasswordCode == dto.code) {
      user.isResetVerified = true;
      user.resetPasswordCode = 0;
      await this.userModel.replaceOne({ _id: user._id }, user);
    }
  }

  async updateResetPassword(dto: UpdateResetPassword, username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isResetVerified) {
      throw new BadRequestException('User not verified');
    }

    const { salt, hash } = user;
    user.hash = hashSync(dto.password, salt);
    user.isResetVerified = false;
    user.resetPasswordCode = 0;
    await this.userModel.replaceOne({ _id: user._id }, user);
    return user;
  }
}
