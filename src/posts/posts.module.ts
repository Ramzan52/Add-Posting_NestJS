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
  ],
  providers: [
    PostsService,
    AzureSASServiceService,
    FavoritePostsService,
    AlertsService,
    FcmTOkenService,
    Firebase_NotificationService,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
