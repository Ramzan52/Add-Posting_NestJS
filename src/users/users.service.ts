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
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';
import { Profile, ProfileDocument } from 'src/profile/schemas/profile.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,

    private readonly busSvc: AzureServiceBusService,
  ) {}

  async changePassword(
    username: string,
    password: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findOne({
      username: username.toLowerCase(),
    });

    const { salt, hash } = user;
    const pwdHash = hashSync(password, salt);

    if (hash !== pwdHash) {
      throw new BadRequestException('Passwords do not match');
    }

    user.hash = hashSync(newPassword, salt);
    await this.userModel.replaceOne({ _id: user._id }, user);
  }

  async create(dto: RegisterDto) {
    let username = dto.username.toLowerCase();
    const exists = await this.findOne(username);

    if (exists) {
      if (exists.username == username) {
        throw new BadRequestException('Email is already registered');
      }
    }
    if (dto.phoneNumber !== '') {
      const phoneExists = await this.findByPhone(dto.phoneNumber);

      if (phoneExists) {
        if (phoneExists.phoneNumber == dto.phoneNumber) {
          throw new BadRequestException('Phone Number is already registered');
        }
      }
    }

    const code = generateRandomSixDigitCode();
    const emailBody = createEmailBody(username, code);

    console.log({ code });
    console.log({ emailBody });

    this.busSvc.sendEmail(emailBody);

    const salt = await genSalt(10);
    const hash = hashSync(dto.password, salt);

    const user = await this.userModel.create({
      username: dto.username.toLowerCase(),
      name: dto.name,
      salt,
      hash,
      registerCode: code,
      isUserVerified: false,
      phoneNumber: dto.phoneNumber,
      generalNotification: true,
      location: {
        title: '',
        latitude: 0,
        longitude: 0,
      },
    });

    return {
      username: user.username,
      name: user.name,
      id: user._id,
    };
  }

  async findOne(username: string) {
    return await this.userModel
      .findOne({ username: username.toLowerCase() })
      .exec();
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
    let username = dto.username.toLowerCase();
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
    const user = await this.userModel.findOne({
      username: username.toLowerCase(),
    });
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
    const user = await this.userModel.findOne({
      username: username.toLowerCase(),
    });
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
    } else {
      user.isResetVerified = false;
      await this.userModel.replaceOne({ _id: user._id }, user);
      throw new BadRequestException('Invalid OTP');
    }
  }

  async updateResetPassword(dto: UpdateResetPassword, username: string) {
    const user = await this.userModel.findOne({
      username: username.toLowerCase(),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isResetVerified) {
      throw new BadRequestException(
        'Please verify OTP before changing password',
      );
    }

    const { salt, hash } = user;
    user.hash = hashSync(dto.password, salt);
    user.isResetVerified = false;
    user.resetPasswordCode = 0;
    await this.userModel.replaceOne({ _id: user._id }, user);
    return user;
  }
  async postCurrentLocation(userId: string, dto: PostLocationSchema) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.location.title = dto.title;
    user.location.latitude = dto.latitude;
    user.location.longitude = dto.longitude;
    await this.userModel.replaceOne(
      { _id: new mongo.ObjectId(user._id) },
      user,
    );
  }

  async postGeneralNotification(userId: string, dto: boolean) {
    const user = await this.userModel.findById(userId).exec();
    const profile = await this.profileModel.findOne({ userId: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.generalNotification = !user.generalNotification;
    profile.generalNotification = !profile.generalNotification;
    await this.userModel.replaceOne(
      { _id: new mongo.ObjectId(user._id) },
      user,
    );
    await this.profileModel.replaceOne({ userId: user._id }, profile);
  }
}
