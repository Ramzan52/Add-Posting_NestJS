import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostModel } from './models/post.model';

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
      createdBy: '',
      createdByUsername: '',
      createdOn: new Date(),
      modifiedBy: '',
      modifiedByUsername: '',
      modifiedOn: new Date(),
      categoryId,
      category: '',
      title,
      description,
      condition,
      location,
      attachmentUrls,
      isActive: true,
      isDeleted: false,
      isVend: false,
    };

    this.posts.push(post);

    return post;
  }

  getPostById(id: string): PostModel {
    const post = this.posts.find((val) => val.categoryId === id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }

    return post;
  }

  deactivatePost(id: string): PostModel {
    const post = this.getPostById(id);
    post.isActive = false;
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
  editPost(dto: UpdatePostDto): PostModel {
    const {
      id,
      categoryId,
      title,
      condition,
      attachmentUrls,
      description,
      location,
    } = dto;
    const post = this.getPostById(id);
    post.categoryId = categoryId;
    post.condition = condition;
    post.attachmentUrls = attachmentUrls;
    post.title = title;
    post.description = description;
    post.location = location;
    return post;
  }
  getPostByLocation(location: string): PostModel[] {
    return this.posts.filter((post) => post.location.title.includes(location));
  }
  myPost(username: string): PostModel[] {
    return this.posts.filter((post) =>
      post.createdByUsername.includes(username),
    );
  }
}
