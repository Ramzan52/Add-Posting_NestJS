import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
// import { notifications } from './notifications';

@Injectable()
export class NotificationsService {
  // private notifications = notifications;
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async getNotifications(): Promise<Array<NotificationDocument>> {
    return await this.notificationModel.find().exec();
  }
}
