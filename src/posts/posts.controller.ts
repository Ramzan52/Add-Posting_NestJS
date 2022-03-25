import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostModal } from './posts.modal';
import { CreatePostsDto } from './dto/create-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get('getAll')
  getPost(): PostModal[] {
    return this.postsService.getPosts();
  }
  @Get('recentPost/:locationTitle')
  getRecentPost(@Param('locationTitle') locationTitle: string) {
    return this.postsService.getPostByLocation(locationTitle);
  }
  @Post('/create')
  @UsePipes(ValidationPipe)
  createPost(@Body() createPostDto: CreatePostsDto) {
    return this.postsService.createPost(createPostDto);
  }
  @Get('/:id')
  getPostById(@Param('id') id: string): PostModal {
    return this.postsService.getPostById(id);
  }
  @Get('/markActive/:id')
  markPostActive(@Param('id') id: string): PostModal {
    return this.postsService.markPostActive(id);
  }
  @Get('/markVend/:id')
  markPostVend(@Param('id') id: string): PostModal {
    return this.postsService.markPostVend(id);
  }
  @Get('/markDelete/:id')
  markPostDeleted(@Param('id') id: string): PostModal {
    return this.postsService.markPostDeleted(id);
  }
}
