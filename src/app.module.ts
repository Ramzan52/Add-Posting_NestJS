import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertsModule } from './alerts/alerts.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AuthModule } from './auth/auth.module';
import { AzureSASServiceModule } from './azure-sasservice/azure-sasservice.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { DeviceTokenModule } from './device_token/device_token.module';
import { FirebaseNotificationModule } from './firebase_notification/firebase_notification.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { ProfileModule } from './profile/profile.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AlertsModule,
    AttachmentsModule,
    AuthModule,
    AzureSASServiceModule,
    CategoriesModule,
    ConfigModule.forRoot(),
    DeviceTokenModule,
    FirebaseNotificationModule,
    MessagesModule,
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    NotificationsModule,
    PostsModule,
    ProfileModule,
    ScheduleModule,
    TestModule,
    UsersModule,
  ],
})
export class AppModule {}
