import { Injectable } from '@nestjs/common';
import { NotificationModel } from './models/notification.model';
import { notifications } from './notifications';

@Injectable()
export class NotificationsService {
  private notifications = notifications;

  getNotifications(): NotificationModel[] {
    return this.notifications;
  }
}
