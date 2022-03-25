import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NeconfigModule } from 'neconfig';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { ProfileModule } from './profile/profile.module';

import { CategoriesModule } from './categories/categories.module';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
  imports: [
    AttachmentsModule,
    AuthModule,
    CategoriesModule,
    NotificationsModule,
    PostsModule,
    ProfileModule,
    MongooseModule.forRoot(
      'mongodb+srv://aquila360:R28xtu462zVBaf02@east-us-01.19lgk.mongodb.net/scrap-ready-dev?retryWrites=true&w=majority',
    ),
    NeconfigModule.register({
      readers: [{ name: 'env', file: path.resolve(process.cwd(), '.env') }],
    }),
  ],
})
export class AppModule {}
