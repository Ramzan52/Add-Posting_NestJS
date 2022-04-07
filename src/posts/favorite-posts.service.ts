import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FavoritePosts } from './schemas/favorite-posts.schema';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class FavoritePostsService {
  constructor(
    @InjectModel(FavoritePosts.name)
    private readonly favoritePostModel: Model<FavoritePosts>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async likePost(postId: string, like: boolean, userId: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} Not Found`);
    }
    if (like) {
      let dto = {
        userId,
        postId,
      };
      const favoritePosts = await new this.favoritePostModel(dto);
      return favoritePosts.save();
    } else {
      await this.favoritePostModel.deleteOne({
        userId: userId,
        postId: postId,
      });
    }
  }
  async myFavPost(userId: string) {
    const favPost = await this.favoritePostModel
      .find({ userId: userId })
      .exec();
    if (!favPost) {
      throw new NotFoundException(`No Favourite Post Found`);
    }

    const pipeline = [
      {
        $lookup: {
          from: 'favoriteposts',
          localField: '_id',
          foreignField: 'postId',
          as: 'details'
        }
      }
    ];

    return this.postModel.aggregate(pipeline);
  }
}
