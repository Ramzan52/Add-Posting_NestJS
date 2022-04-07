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
      'mongodb://appsadmin:5bz8F5p7WPupf0TP@australia-east-01-shard-00-00.skjwl.mongodb.net:27017,australia-east-01-shard-00-01.skjwl.mongodb.net:27017,australia-east-01-shard-00-02.skjwl.mongodb.net:27017/scrap-ready-dev?ssl=true&replicaSet=atlas-p7olib-shard-0&authSource=admin&retryWrites=true&w=majority',
    ),
    NeconfigModule.register({
      readers: [{ name: 'env', file: path.resolve(process.cwd(), '.env') }],
    }),
    AlertsModule,
    AzureSASServiceModule,
    FirebaseNotificationModule,
    MessagesModule,
  ],
})
export class AppModule {}
