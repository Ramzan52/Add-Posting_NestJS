import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';

import { CategoriesModule } from './categories/categories.module';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
  imports: [PostsModule, NotificationsModule, ProfileModule, CategoriesModule, AttachmentsModule],
})
export class AppModule {}
