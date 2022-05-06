import { CreateDeviceTokenDto } from './dto/post.device.token';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DeviceToken, DeviceTokenDocument } from './schema/device_token.schema';
import { Model } from 'mongoose';
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
      const existingToken = await this.deviceTokenModal.findOne({
        userId: data.userId,
        token: data.token,
      });
      if (!existingToken) {
        const DeviceToken = await new this.deviceTokenModal(data);
        DeviceToken.save();
        return DeviceToken;
      }
      return existingToken;
    } catch {
      // try {
      //   const existingUser = await this.deviceTokenModal.findOneAndReplace(
      //     { userId: username },
      //     data,
      //     { new: true },
      //   );
      //   if (!existingUser) {
      //     try {
      //       const DeviceToken = await new this.deviceTokenModal(data);
      //       DeviceToken.save();
      //       return DeviceToken;
      //     } catch {
      //       throw new BadRequestException();
      //     }
      //   }
      //   return existingUser;
      // }
      throw new BadRequestException();
    }
  }
  async deleteDeviceToken(username: String, dto: CreateDeviceTokenDto) {
    let data = {
      userId: username,
      token: dto.token,
    };
    try {
      const existingToken = await this.deviceTokenModal.findOne({
        userId: data.userId,
        token: data.token,
      });
      if (existingToken) {
        await this.deviceTokenModal.deleteOne({
          userId: data.userId,
          token: data.token,
        });
      }
      return;
    } catch {
      throw new BadRequestException();
    }
  }
  async deleteToken(token: String, userId: string) {
    try {
      const existingToken = await this.deviceTokenModal.findOne({
        token: token,
        userId: userId,
      });
      if (existingToken) {
        await this.deviceTokenModal.deleteOne({
          token: token,
          userId: userId,
        });
      }
      return;
    } catch {
      console.log('token not deleted');
    }
  }
}
