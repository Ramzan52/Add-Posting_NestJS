import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { FirebaseNotificationController } from './firebase_notification.controller';
import { Firebase_NotificationService } from './firebase_notification.service';
import {
  NotificationFirebaseSchema,
  PostFirebaseNotification,
} from './schema/post.notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostFirebaseNotification.name,
        schema: NotificationFirebaseSchema,
      },
    ]),
  ],
  controllers: [FirebaseNotificationController],
  providers: [Firebase_NotificationService],
})
export class FirebaseNotificationModule {}
