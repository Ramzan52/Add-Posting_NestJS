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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: FavoritePosts.name, schema: FavoritePostsSchema },
    ]),
  ],
  providers: [PostsService, AzureSASServiceService, FavoritePostsService],
  controllers: [PostsController],
})
export class PostsModule {}
