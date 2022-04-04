import { PostNotification } from './dto/post.notification';
import {
  Notification,
  NotificationDocument,
} from './../notifications/schemas/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class Firebase_NotificationService {
  constructor(
    @InjectModel(PostNotification.name)
    private readonly notification: Model<NotificationDocument>,
  ) {}
  PostNotification(dto: PostNotification) {
    const notification = new this.notification(dto);
    return notification.save();
  }
}
