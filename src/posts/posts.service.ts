import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async getPosts() {
    return await this.postModel.find({ isDeleted: false }).exec();
  }

  async createPost(dto: CreatePostDto, tokenData: any) {
    const {
      categoryId,
      title,
      description,
      condition,
      attachmentUrls,
      location,
    } = dto;

    const post = await this.postModel.create({
      categoryId: new mongo.ObjectId(categoryId),
      title: title,
      description: description,
      condition: condition,
      attachmentUrls: attachmentUrls,
      location: location,
      isActive: true,
      isDeleted: false,
      isVend: false,
      createdByUsername: tokenData.user.username,
      createdBy: tokenData.user.name,
      createdOn: new Date(new Date().toUTCString()),
      modifiedByUsername: tokenData.user.username,
      modifiedBy: tokenData.user.name,
      modifiedOn: new Date(new Date().toUTCString()),
    });
    return post;
  }

  async getPostById(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();
    if (!post || post.isDeleted) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }

    return post;
  }

  async activatePost(id: string, isActive: boolean): Promise<PostDocument> {
    const post = await this.getPostById(id);

    if (!post || post.isDeleted) {
      throw new NotFoundException();
    }

    post.isActive = isActive;
    await this.postModel.replaceOne(
      { _id: new mongo.ObjectId(post._id) },
      post,
    );

    return post;
  }

  async markVend(id: string, isVend: boolean): Promise<PostDocument> {
    const post = await this.getPostById(id);

    if (!post || post.isDeleted) {
      throw new NotFoundException();
    }

    post.isVend = isVend;
    await this.postModel.replaceOne(
      { _id: new mongo.ObjectId(post._id) },
      post,
    );

    return post;
  }

  async delete(id: string): Promise<PostDocument> {
    const post = await this.getPostById(id);
    if (!post || post.isDeleted) {
      throw new NotFoundException();
    }

    post.isDeleted = true;
    await this.postModel.replaceOne(
      { _id: new mongo.ObjectId(post._id) },
      post,
    );

    return post;
  }

  async editPost(dto: UpdatePostDto): Promise<PostDocument> {
    const {
      id,
      categoryId,
      title,
      condition,
      attachmentUrls,
      description,
      location,
    } = dto;

    const post = await this.getPostById(id);

    post.categoryId = categoryId;
    post.condition = condition;
    post.attachmentUrls = attachmentUrls;
    post.title = title;
    post.description = description;
    post.location = location;

    await this.postModel.replaceOne(
      { _id: new mongo.ObjectId(post._id) },
      post,
    );

    return post;
  }

  async getPostByLocation(location: string): Promise<Array<PostDocument>> {
    return await this.postModel.find({
      'location.title': { $regex: '.*' + location + '.*' },
      isDeleted: false,
    });
  }

  async myPost(username: any): Promise<Array<PostDocument>> {
    const post = await this.postModel
      .find({ createdByUsername: username, isDeleted: false })
      .exec();
    return post;
  }
}
