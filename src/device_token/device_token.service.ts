import { CreateDeviceTokenDto } from './dto/post.device.token';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { DeviceToken, DeviceTokenDocument } from './schema/device_token.schema';
import { Model } from 'mongoose';
import admin from 'firebase-admin';
@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModal: Model<DeviceTokenDocument>,
  ) {}

  postDeviceToken(username: String, dto: CreateDeviceTokenDto) {
    let data = {
      username,
      token: dto,
    };
    const DeviceToken = new this.deviceTokenModal(data);
    return DeviceToken.save();
  }
  sendNotification(token: string) {
    var message = {
      apns: {
        headers: {
          'apns-priority': '10',
        },
        payload: {
          aps: {
            alert: {
              body: 'hii',
              title: 'hello',
            },
            sound: 'dafault',
          },
        },
      },
      token: token,
    };
    admin.messaging().send(message);
  }
}
