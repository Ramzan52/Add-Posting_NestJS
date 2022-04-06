import { PostNotification } from './dto/post.notification';
import {
  Notification,
  NotificationDocument,
} from './../notifications/schemas/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  FirebaseNotificationDocument,
  PostFirebaseNotification,
} from './schema/post.notification.schema';

@Injectable()
export class Firebase_NotificationService {
  constructor(
    @InjectModel(PostFirebaseNotification.name)
    private readonly notificationModel: Model<FirebaseNotificationDocument>,
  ) {}
  async PostNotification(dto: PostNotification) {
    const notification = await new this.notificationModel(dto);
    return notification.save();
  }
  async getNotifications(
    userId: string,
  ): Promise<Array<FirebaseNotificationDocument>> {
    let notifications = await this.notificationModel.find({ userId }).exec();
    if (!notifications) {
      throw new NotFoundException('no notification found');
    }
    return notifications;
  }
}
