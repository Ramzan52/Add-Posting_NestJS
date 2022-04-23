import { Firebase_NotificationService } from './../firebase_notification/firebase_notification.service';
import {
  DeviceToken,
  DeviceTokenSchema,
} from './../device_token/schema/device_token.schema';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { ConversationService } from './conversation.service';
import { Message, MessageSchema } from './schema/post.message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { FcmTOkenService } from './fcmNotification.service';
import {
  NotificationFirebaseSchema,
  PostFirebaseNotification,
} from 'src/firebase_notification/schema/post.notification.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import { Profile, ProfileSchema } from 'src/profile/schemas/profile.schema';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { ProfileService } from 'src/profile/profile.service';
import { UsersService } from 'src/users/users.service';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    MongooseModule.forFeature([
      { name: DeviceToken.name, schema: DeviceTokenSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: PostFirebaseNotification.name,
        schema: NotificationFirebaseSchema,
      },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],

  controllers: [MessagesController],
  providers: [
    MessagesService,
    ConversationService,
    FcmTOkenService,
    Firebase_NotificationService,
    AzureSASServiceService,
    ProfileService,
    UsersService,
    AzureServiceBusService,
  ],
})
export class MessagesModule {}
