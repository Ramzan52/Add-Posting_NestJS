import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async getPosts() {
    return await this.postModel.find().exec();
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
    if (!post) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }

    return post;
  }

  async deactivatePost(id: string): Promise<PostDocument> {
    const post = await this.getPostById(id);
    console.log(post);
    if (!post) {
      throw new NotFoundException();
    }
    post.isActive = false;
    await this.postModel.replaceOne(
      { _id: new mongo.ObjectId(post._id) },
      post,
    );
    return post;
  }

  async markPostVend(id: string): Promise<PostDocument> {
    const post = await this.getPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    post.isVend = true;
    await this.postModel.replaceOne(
      { _id: new mongo.ObjectId(post._id) },
      post,
    );
    return post;
  }

  async markPostDeleted(id: string): Promise<PostDocument> {
    const post = await this.getPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    post.isDeleted = true;
    await this.postModel.replaceOne({ _id: post._id }, post);
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
    await this.postModel.replaceOne({ _id: post._id });
    return post;
  }

  async getPostByLocation(location: string): Promise<Array<PostDocument>> {
    // return this.posts.filter((post) => post.location.title.includes(location));
    return await this.postModel.find({
      'location.title': { $regex: '.*' + location + '.*' },
    });
  }

  async myPost(username: any): Promise<Array<PostDocument>> {
    const post = await this.postModel
      .find({ createdByUsername: username })
      .exec();
    console.log(post);
    return post;
  }
}
