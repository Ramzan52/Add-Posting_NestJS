import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from './models/post.model';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';

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
  createPost(@Body() body: CreatePostDto): PostModel {
    return this.postsSvc.createPost(body);
  }

  @Get('/:id')
  getPostById(@Param('id') id: string): PostModel {
    return this.postsSvc.getPostById(id);
  }

  @Get('/deactivate/:id')
  deactivatePost(@Param('id') id: string): PostModel {
    return this.postsSvc.deactivatePost(id);
  }

  @Get('/mark-vend/:id')
  markPostVend(@Param('id') id: string): PostModel {
    return this.postsSvc.markPostVend(id);
  }

  @Get('/my/:username')
  myPosts(@Param('username') username: string) {
    return this.postsSvc.myPost(username);
  }

  @Delete(':id')
  markPostDeleted(@Param('id') id: string) {
    this.postsSvc.markPostDeleted(id);
  }

  @Put('/edit')
  editPost(@Body() body: UpdatePostDto) {
    return this.postsSvc.editPost(body);
  }
}
