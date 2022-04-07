import { PostChat, PostChatSchema } from './schema/post.schema';
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
    MongooseModule.forFeature([
      {
        name: PostChat.name,
        schema: PostChatSchema,
      },
    ]),
  ],

  controllers: [MessagesController],
  providers: [
    MessagesService,
    ConversationService,
    FcmTOkenService,
    Firebase_NotificationService,
  ],
})
export class MessagesModule {}
