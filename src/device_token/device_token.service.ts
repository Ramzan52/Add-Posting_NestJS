import { CreateDeviceTokenDto } from './dto/post.device.token';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { DeviceToken, DeviceTokenDocument } from './schema/device_token.schema';
import { Model } from 'mongoose';
import admin from 'firebase-admin';
@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModal: Model<DeviceTokenDocument>,
  ) {}

  async postDeviceToken(username: String, dto: CreateDeviceTokenDto) {
    let data = {
      userId: username,
      token: dto.token,
    };
    try {
      const existingUser = await this.deviceTokenModal.findOneAndReplace(
        { userId: username },
        data,
        { new: true },
      );
      if (!existingUser) {
        try {
          const DeviceToken = await new this.deviceTokenModal(data);
          DeviceToken.save();
          return DeviceToken;
        } catch {
          throw new BadRequestException();
        }
      }
      return existingUser;
    } catch {
      throw new BadRequestException();
    }
  }
}
