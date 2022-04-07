import { DeviceTokenModule } from './device_token/device_token.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NeconfigModule } from 'neconfig';
import * as path from 'path';
import { AlertsModule } from './alerts/alerts.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AuthModule } from './auth/auth.module';

import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { ProfileModule } from './profile/profile.module';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';
import { AzureSASServiceModule } from './azure-sasservice/azure-sasservice.module';
import { FirebaseNotificationModule } from './firebase_notification/firebase_notification.module';
import { MessagesModule } from './messages/messages.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    AttachmentsModule,
    AuthModule,
    CategoriesModule,
    NotificationsModule,
    PostsModule,
    ProfileModule,
    TestModule,
    UsersModule,
    DeviceTokenModule,
    MongooseModule.forRoot(
      'mongodb://aquila360:R28xtu462zVBaf02@east-us-01-shard-00-00.19lgk.mongodb.net:27017,east-us-01-shard-00-01.19lgk.mongodb.net:27017,east-us-01-shard-00-02.19lgk.mongodb.net:27017/scrap-ready-dev?replicaSet=atlas-r03cto-shard-0&ssl=true&authSource=admin',
    ),
    NeconfigModule.register({
      readers: [{ name: 'env', file: path.resolve(process.cwd(), '.env') }],
    }),
    AlertsModule,
    AzureSASServiceModule,
    FirebaseNotificationModule,
    MessagesModule,
    ScheduleModule,
  ],
})
export class AppModule {}
