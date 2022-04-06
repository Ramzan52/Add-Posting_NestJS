import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

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
  async getPosts(@Query('search') search?: string) {
    console.log("search", search);
    const posts = await this.postsSvc.getPosts(search);
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

  @Put('fav/:id/:like')
  async likePost(@Param('id') id: string, @Param('like') like : boolean) {
    const existingPost = await this.postsSvc.getPostById(id);
    if (!existingPost || existingPost.isDeleted) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }
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
  @Post('/:id/active/:isActive')
  async activatePost(
    @Param('id') id: string,
    @Param('isActive') isActive: boolean,
  ) {
    const post = await this.postsSvc.activatePost(id, isActive);

    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/vend/:isVend')
  async markPostVend(
    @Param('id') id: string,
    @Param('isVend') isVend: boolean,
  ) {
    const post = await this.postsSvc.markVend(id, isVend);
    return {
      post,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async markPostDeleted(@Param('id') id: string) {
    const post = await this.postsSvc.delete(id);
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
