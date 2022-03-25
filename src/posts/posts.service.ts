import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from './models/posts.model';

@Injectable()
export class PostsService {
  private posts: PostModel[] = [];

  getPosts(): PostModel[] {
    return this.posts;
  }

  createPost(dto: CreatePostDto) {
    const {
      categoryId,
      title,
      description,
      condition,
      attachmentUrls,
      location,
    } = dto;

    const post: PostModel = {
      id: uuid(),
      categoryId,
      category: '',
      title,
      description,
      condition,
      location,
      attachmentUrls,
      isActive: false,
      isDeleted: false,
      isVend: false,
    };

    this.posts.push(post);
  }

  getPostById(id: string): PostModel {
    const post = this.posts.find((val) => val.categoryId === id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }

    return post;
  }

  markPostActive(id: string): PostModel {
    const post = this.getPostById(id);
    post.isActive = true;
    return post;
  }

  markPostVend(id: string): PostModel {
    const post = this.getPostById(id);
    post.isVend = true;
    return post;
  }

  markPostDeleted(id: string): PostModel {
    const post = this.getPostById(id);
    post.isDeleted = true;
    return post;
  }

  getPostByLocation(location: string): PostModel[] {
    return this.posts.filter((post) => post.location.title.includes(location));
  }
}
