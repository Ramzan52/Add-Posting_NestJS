import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { SaveProfileDto } from './dto/save-profile.dto';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async create(dto: RegisterDto) {
    const profile = await this.profileModel.create({
      email: dto.username,
      name: dto.name,
    });

    return profile;
  }

  async findOne(username: string): Promise<ProfileDocument> {
    return await this.profileModel.findOne({ email: username });
  }

  async editProfile(username: string, dto: SaveProfileDto) {
    const { name, profilePic, phoneNumber } = dto;

    let profile = await this.findOne(username);

    if (!profile) {
      profile = await this.profileModel.create({
        name,
        email: username,
        phoneNumber,
        profilePic,
      });
    } else {
      profile.name = name;
      profile.phoneNumber = phoneNumber;
      profile.profilePic = profilePic;

      await this.profileModel.replaceOne({ _id: profile._id }, profile);
    }

    return profile;
  }
}
