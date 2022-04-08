import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertsModule } from './alerts/alerts.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AuthModule } from './auth/auth.module';
import { AzureSASServiceModule } from './azure-sasservice/azure-sasservice.module';
import { AzureServiceBusModule } from './azure-servicebus/azure-servicebus.module';
import { CategoriesModule } from './categories/categories.module';
import { getEnvPath } from './common/helper/env.helper';
import { DeviceTokenModule } from './device_token/device_token.module';
import { FirebaseNotificationModule } from './firebase_notification/firebase_notification.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { ProfileModule } from './profile/profile.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    AlertsModule,
    AttachmentsModule,
    AuthModule,
    AzureSASServiceModule,
    AzureServiceBusModule,
    CategoriesModule,
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
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
