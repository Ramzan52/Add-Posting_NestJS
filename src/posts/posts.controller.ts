import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from './models/post.model';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/auth-guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() body: CreatePostDto): PostModel {
    return this.postsSvc.createPost(body);
  }

  @Get('/:id')
  getPostById(@Param('id') id: string): PostModel {
    return this.postsSvc.getPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/deactivate/:id')
  deactivatePost(@Param('id') id: string): PostModel {
    return this.postsSvc.deactivatePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mark-vend/:id')
  markPostVend(@Param('id') id: string): PostModel {
    return this.postsSvc.markPostVend(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  myPosts(@Request() req: any) {
    return this.postsSvc.myPost(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  markPostDeleted(@Param('id') id: string) {
    this.postsSvc.markPostDeleted(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editPost(@Body() body: UpdatePostDto) {
    return this.postsSvc.editPost(body);
  }
}
