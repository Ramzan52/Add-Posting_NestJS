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
    const notification = await this.notificationModel.create({
      type: dto.type,
      sentOn: dto.sentOn,
      payLoad: dto.payLoad,
      userId: dto.userId,
    });
    return notification;
  }
  async getNotifications(userId: string, pageSize: number, pageNumber: number) {
    let notifications = await this.notificationModel.find({ userId }).exec();
    if (!notifications) {
      throw new NotFoundException('no notification found');
    }
    const count = await this.notificationModel
      .find({ userId })
      .countDocuments();
    const query = this.notificationModel.find({ userId });
    const response = await this.notificationModel
      .find({ userId: userId })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([['sentOn', -1]])
      .exec();

    return {
      count: count,
      result: response,
    };
  }
}
