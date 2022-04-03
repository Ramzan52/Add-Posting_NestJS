import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchema, Post } from './schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AzureSASServiceService } from '../azure-sasservice/azure-sasservice.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostsService, AzureSASServiceService],
  controllers: [PostsController],
})
export class PostsModule {}
