import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  DeviceToken,
  DeviceTokenSchema,
} from 'src/device_token/schema/device_token.schema';
import {
  NotificationFirebaseSchema,
  PostFirebaseNotification,
} from 'src/firebase_notification/schema/post.notification.schema';
import { Firebase_NotificationService } from 'src/firebase_notification/firebase_notification.service';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { Profile, ProfileSchema } from 'src/profile/schemas/profile.schema';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { DeviceTokenService } from 'src/device_token/device_token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: DeviceToken.name, schema: DeviceTokenSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: PostFirebaseNotification.name,
        schema: NotificationFirebaseSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],

  providers: [
    ScheduleService,
    Firebase_NotificationService,
    AzureSASServiceService,
    AzureServiceBusService,
    DeviceTokenService,
  ],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
