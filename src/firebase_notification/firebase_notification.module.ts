import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { FirebaseNotificationController } from './firebase_notification.controller';
import { Firebase_NotificationService } from './firebase_notification.service';
import {
  NotificationSchema,
  PostNotification,
} from './schema/post.notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostNotification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [FirebaseNotificationController],
  providers: [Firebase_NotificationService],
})
export class FirebaseNotificationModule {}
