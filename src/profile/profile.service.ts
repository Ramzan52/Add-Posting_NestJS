import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { SaveProfileDto } from './dto/save-profile.dto';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly userSvc: UsersService,
  ) {}

  async create(dto: RegisterDto, userId: string) {
    const profile = await this.profileModel.create({
      email: dto.username,
      name: dto.name,
      userId: userId,
      phoneNumber: dto.phoneNumber,
    });

    return profile;
  }

  async findOne(username: string): Promise<ProfileDocument> {
    return await this.profileModel.findOne({ email: username });
  }

  async findByUserId(id: string): Promise<ProfileDocument> {
    return await this.profileModel.findOne({ userId: id });
  }

  async editProfile(username: string, dto: SaveProfileDto) {
    const { name, profilePic, phoneNumber } = dto;

    let profile = await this.findOne(username);

    if (!profile) {
      throw new NotFoundException('Profile not found');
      // profile = await this.profileModel.create({
      //   name,
      //   email: username,
      //   phoneNumber,
      //   profilePic,
      // });
    } else {
      profile.name = name;
      profile.phoneNumber = phoneNumber;
      profile.profilePic = profilePic;

      await this.profileModel.replaceOne({ _id: profile._id }, profile);

      let user = await this.userSvc.findById(profile.userId);
      if (user) {
        user.name = profile.name;
        user.phoneNumber = profile.phoneNumber;

        await this.userSvc.update(user);
      }
    }

    return profile;
  }
}
