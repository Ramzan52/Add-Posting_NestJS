import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { LikePostQueryDto } from './dto/like-post-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FavoritePostsService } from './favorite-posts.service';
import { PostsService } from './posts.service';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsSvc: PostsService,
    private sasSvc: AzureSASServiceService,
    private favSvc: FavoritePostsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async myPosts(@Request() req: any) {
    return {
      posts: await this.postsSvc.myPost(req.user.username),
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(@Request() req: any, @Query() query: GetPostsQueryDto) {
    const { categoryId, location, pageNumber, pageSize, search } = query;

    const posts = await this.postsSvc.getPosts(
      search,
      location,
      pageSize,
      pageNumber,
      req.user.id,
      categoryId,
    );

    return {
      list: posts,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Request() req: any, @Body() body: CreatePostDto) {
    return {
      post: await this.postsSvc.createPost(body, req),
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post('fav')
  async likePost(@Query() query: LikePostQueryDto, @Request() req: any) {
    await this.favSvc.likePost(query.postId, query.like, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('fav')
  async myFavPosts(@Req() req: any) {
    return {
      list: await this.favSvc.myFavPost(req.user.id),
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string) {
    return {
      post: await this.postsSvc.getPostById(id),
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/active/:isActive')
  async activatePost(
    @Param('id') id: string,
    @Param('isActive') isActive: boolean,
  ) {
    return {
      post: await this.postsSvc.activatePost(id, isActive),
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/vend/:isVend')
  async markPostVend(
    @Param('id') id: string,
    @Param('isVend') isVend: boolean,
  ) {
    return {
      post: await this.postsSvc.markVend(id, isVend),
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async markPostDeleted(@Param('id') id: string) {
    return {
      post: await this.postsSvc.delete(id),
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async editPost(@Body() body: UpdatePostDto) {
    return {
      post: await this.postsSvc.editPost(body),
      sas: this.sasSvc.getNewSASKey(),
    };
  }
}
