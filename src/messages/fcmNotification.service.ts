import { Firebase_NotificationService } from './../firebase_notification/firebase_notification.service';
import { Conversation } from './schema/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  DeviceToken,
  DeviceTokenDocument,
} from 'src/device_token/schema/device_token.schema';
import admin from 'firebase-admin';
import { Alert } from 'src/alerts/schema/alert.schema';
import { DeviceTokenService } from 'src/device_token/device_token.service';

@Injectable()
export class FcmTOkenService {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModal: Model<DeviceTokenDocument>,
    private readonly firebaseSvc: Firebase_NotificationService,
    private readonly DeviceTokenSvc: DeviceTokenService,
  ) {}

  async findDeviceToken(id: string, message: Conversation) {
    let fcmToken = await this.deviceTokenModal.find({ userId: id });
    if (fcmToken.length > 0) {
      for (let token of fcmToken) {
        let payload: admin.messaging.Message = {
          data: {
            message: JSON.stringify(message),
            type: 'new-message',
          },
          token: token.token,
        };
        try {
          admin
            .messaging()
            .send(payload)
            .then((response) => {
              console.log('send');
            })
            .catch((error) => {
              this.DeviceTokenSvc.deleteToken(token.token, token.userId).then(
                (err) => {
                  console.log(err);
                },
              );
              console.log('error', error);
            });
        } catch (e) {
          console.log('message', e);
        }
      }
    }
    // let fcmToken = await this.deviceTokenModal.findOne({ userId: id });
    // if (fcmToken && fcmToken.token !== null) {
    //   let payload: admin.messaging.Message = {
    //     data: { message: JSON.stringify(message), type: 'new-message' },
    //     token: fcmToken.token,
    //   };
    //   admin.messaging().send(payload);
    //   // let notif = await this.firebaseSvc.PostNotification({
    //   //   type: 'new-message',
    //   //   payLoad: message,
    //   //   sentOn: new Date(),
    //   //   userId: id,
    //   // });
    // }
  }

  async sendAlertNotification(id: string, tokens: any, alert: Alert) {
    let payload: admin.messaging.Message = {
      data: { message: JSON.stringify(alert), type: 'new-alert' },
      token: tokens,
    };
    admin.messaging().send(payload);
    this.firebaseSvc.PostNotification({
      type: 'new-alert',
      payLoad: alert,
      sentOn: new Date(),
      userId: id,
    });
  }
}
