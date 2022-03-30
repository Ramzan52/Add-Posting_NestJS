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
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { PostDocument } from './schemas/post.schema';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsSvc: PostsService) {}

  @Get()
  async getPosts(): Promise<Array<PostDocument>> {
    return await this.postsSvc.getPosts();
  }

  @Get('recentPosts/:location')
  async getRecentPost(
    @Param('location') location: string,
  ): Promise<Array<PostDocument>> {
    return await this.postsSvc.getPostByLocation(location);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<PostDocument> {
    return await this.postsSvc.createPost(body);
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<PostDocument> {
    return await this.postsSvc.getPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/deactivate/:id')
  async deactivatePost(@Param('id') id: string): Promise<PostDocument> {
    return await this.postsSvc.deactivatePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/mark-vend/:id')
  async markPostVend(@Param('id') id: string): Promise<PostDocument> {
    return await this.postsSvc.markPostVend(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async myPosts(@Request() req: any): Promise<Array<PostDocument>> {
    return await this.postsSvc.myPost(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async markPostDeleted(@Param('id') id: string): Promise<PostDocument> {
    return await this.postsSvc.markPostDeleted(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async editPost(@Body() body: UpdatePostDto): Promise<PostDocument> {
    return await this.postsSvc.editPost(body);
  }
}
