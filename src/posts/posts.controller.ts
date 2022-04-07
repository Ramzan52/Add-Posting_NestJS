import { FavoritePostsService } from './favorite-posts.service';
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
  Req,
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
    private favSvc: FavoritePostsService,
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
  async getPosts(@Query("pageSize") pageSize: number, @Query("pageNumber") pageNumber: number, @Query('search') search?: string) {
    console.log("search", search);
    const posts = await this.postsSvc.getPosts(search, pageSize, pageNumber);
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
  @UseGuards(JwtAuthGuard)
  @Post('fav/:id/:like')
  async likePost(
    @Param('postId') postId: string,
    @Param('like') like: boolean,
    @Request() req: any,
  ) {
    let favPost = await this.favSvc.likePost(postId, like, req.user.id);
    return favPost;
  }

  @Get('my-favourite/post')
  async mypost(@Req() req: any) {
    console.log(req.user);
    // let favPost = await this.favSvc.myFavPost(req.user.id);
    let favPost = await this.favSvc.myFavPost('623dc7488751e150d021c303');

    return favPost;
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
