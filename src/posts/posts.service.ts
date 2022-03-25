import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostModal } from './posts.modal';
import { v1 as uuid } from 'uuid';
import { CreatePostsDto } from './dto/create-posts.dto';

@Injectable()
export class PostsService {
  private Posts: PostModal[] = [];

  getPosts(): PostModal[] {
    return this.Posts;
  }
  createPost(createPostDto: CreatePostsDto) {
    const { title, description, condition, attachmentUrls, location } =
      createPostDto;
    if (condition < 0 || condition > 100) {
      throw new BadRequestException('Condition must be in 0-100');
    }

    const post: PostModal = {
      categoryId: uuid(),
      title,
      description,
      condition,
      location,
      attachmentUrls,
      isActive: false,
      isDelete: false,
      isVend: false,
    };
    this.Posts.push(post);
  }
  getPostById(id: string): PostModal {
    const found = this.Posts.find((val) => val.categoryId === id);
    if (!found) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }
    return found;
  }
  markPostActive(id: string): PostModal {
    const found = this.Posts.find((val) => val.categoryId === id);

    if (!found) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }
    found.isActive = true;
    return found;
  }
  markPostVend(id: string): PostModal {
    const found = this.Posts.find((val) => val.categoryId === id);

    if (!found) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }
    found.isVend = true;
    return found;
  }
  markPostDeleted(id: string): PostModal {
    const found = this.Posts.find((val) => val.categoryId === id);

    if (!found) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }
    found.isDelete = true;
    return found;
  }
  getPostByLocation(locationTitle: string): PostModal[] {
    let posts = this.getPosts();
    if (locationTitle) {
      posts = posts.filter((post) =>
        post.location.title.includes(locationTitle),
      );
    }
    return posts;
  }
}
