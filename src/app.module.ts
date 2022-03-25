import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [PostsModule, NotificationsModule, ProfileModule],
})
export class AppModule {}
