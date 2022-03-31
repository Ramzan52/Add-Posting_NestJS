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
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsSvc: PostsService,
    private sasSvc: AzureSASServiceService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async myPosts(@Request() req: any) {
    console.log(req);
    const posts = await this.postsSvc.myPost(req.user.username);
    return {
      posts,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @Get()
  async getPosts() {
    const posts = await this.postsSvc.getPosts();
    return {
      list: posts,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @Get('recentPosts/:location')
  async getRecentPost(@Param('location') location: string) {
    const posts = await this.postsSvc.getPostByLocation(location);
    return {
      list: posts,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Request() req: any, @Body() body: CreatePostDto) {
    const post = await this.postsSvc.createPost(body, req);
    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postsSvc.getPostById(id);
    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/deactivate/:id')
  async deactivatePost(@Param('id') id: string) {
    const post = await this.postsSvc.deactivatePost(id);
    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/mark-vend/:id')
  async markPostVend(@Param('id') id: string) {
    const post = await this.postsSvc.markPostVend(id);
    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async markPostDeleted(@Param('id') id: string) {
    const post = await this.postsSvc.markPostDeleted(id);
    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async editPost(@Body() body: UpdatePostDto) {
    const post = await this.postsSvc.editPost(body);
    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }
}
