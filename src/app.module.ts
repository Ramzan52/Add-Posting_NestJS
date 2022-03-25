import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';

import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PostsModule, NotificationsModule, ProfileModule, CategoriesModule],
})
export class AppModule {}
