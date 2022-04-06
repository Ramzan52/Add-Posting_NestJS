import { Firebase_NotificationService } from './../firebase_notification/firebase_notification.service';
import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { PostMessage } from './dto/create.message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostConversation } from './dto/create.conversation.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { send } from 'process';
import { identity } from 'rxjs';
import {
  DeviceToken,
  DeviceTokenDocument,
} from 'src/device_token/schema/device_token.schema';
import admin from 'firebase-admin';

@Injectable()
export class FcmTOkenService {
  constructor(
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModal: Model<DeviceTokenDocument>,
    private readonly firebaseSvc: Firebase_NotificationService,
  ) {}
  async findDeviceToken(id: string, message: PostMessage) {
    let fcmToken = await this.deviceTokenModal.findOne({ userId: id });
    if (fcmToken.token !== null) {
      let payload: admin.messaging.Message = {
        data: { message: JSON.stringify(message), type: 'new-message' },
        token: fcmToken.token,
      };
      admin.messaging().send(payload);
      this.firebaseSvc.PostNotification({
        type: 'new-message',
        payLoad: message.text,
        sentOn: new Date(),
        userId: id,
      });
    }
  }
}
