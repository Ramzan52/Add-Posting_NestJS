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
  async getNotifications(userId: string, pageSize: number, pageNumber: number) {
    let notifications = await this.notificationModel.find({ userId }).exec();
    if (!notifications) {
      throw new NotFoundException('no notification found');
    }
    var count = await this.notificationModel.find({ userId }).countDocuments();
    var query = this.notificationModel.find({ userId });
    var count = await query.countDocuments();
    var response = await this.notificationModel
      .find({ userId })
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
