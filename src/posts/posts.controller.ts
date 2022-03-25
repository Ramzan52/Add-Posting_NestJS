import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from './models/posts.model';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsSvc: PostsService) {}

  @Get()
  getPosts(): PostModel[] {
    return this.postsSvc.getPosts();
  }

  @Get('recentPosts/:location')
  getRecentPost(@Param('location') location: string) {
    return this.postsSvc.getPostByLocation(location);
  }

  @Post()
  createPost(@Body() body: CreatePostDto) {
    return this.postsSvc.createPost(body);
  }

  @Get('/:id')
  getPostById(@Param('id') id: string): PostModel {
    return this.postsSvc.getPostById(id);
  }

  @Get('/mark-active/:id')
  markPostActive(@Param('id') id: string): PostModel {
    return this.postsSvc.markPostActive(id);
  }

  @Get('/mark-vend/:id')
  markPostVend(@Param('id') id: string): PostModel {
    return this.postsSvc.markPostVend(id);
  }

  @Delete(':id')
  markPostDeleted(@Param('id') id: string) {
    this.postsSvc.markPostDeleted(id);
  }
}
