import { FavoritePostsService } from './favorite-posts.service';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchema, Post } from './schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AzureSASServiceService } from '../azure-sasservice/azure-sasservice.service';
import {
  FavoritePosts,
  FavoritePostsSchema,
} from './schemas/favorite-posts.schema';
import { AlertsService } from 'src/alerts/alerts.service';
import { Alert, AlertSchema } from 'src/alerts/schema/alert.schema';
import {
  DeviceToken,
  DeviceTokenSchema,
} from 'src/device_token/schema/device_token.schema';
import { FcmTOkenService } from 'src/messages/fcmNotification.service';
import { Firebase_NotificationService } from 'src/firebase_notification/firebase_notification.service';
import {
  NotificationFirebaseSchema,
  PostFirebaseNotification,
} from 'src/firebase_notification/schema/post.notification.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Profile, ProfileSchema } from 'src/profile/schemas/profile.schema';
import { DeviceTokenService } from 'src/device_token/device_token.service';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: FavoritePosts.name, schema: FavoritePostsSchema },
    ]),
    MongooseModule.forFeature([
      { name: DeviceToken.name, schema: DeviceTokenSchema },
    ]),
    MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
    MongooseModule.forFeature([
      {
        name: PostFirebaseNotification.name,
        schema: NotificationFirebaseSchema,
      },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  providers: [
    PostsService,
    AzureSASServiceService,
    FavoritePostsService,
    AlertsService,
    FcmTOkenService,
    Firebase_NotificationService,
    DeviceTokenService,
    AzureServiceBusService,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
