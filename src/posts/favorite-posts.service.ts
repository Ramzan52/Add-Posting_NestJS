import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
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
      const favoritePosts = await this.favoritePostModel.create({
        userId: userId,
        postId: new mongo.ObjectId(postId),
      });
      return favoritePosts;
    } else {
      await this.favoritePostModel.deleteOne({
        userId: userId,
        postId: new mongo.ObjectId(postId),
      });
    }
  }

  async myFavPost(userId: string) {
    const favPost = await this.favoritePostModel
      .find({ userId: userId })
      .populate('postId')
      .exec();
    if (!favPost) {
      throw new NotFoundException(`No Favourite Post Found`);
    }

    return favPost;
  }
}
