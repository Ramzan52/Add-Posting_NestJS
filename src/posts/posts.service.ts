import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { exec } from 'child_process';
import { Model, mongo } from 'mongoose';
import { Alert, AlertDocument } from 'src/alerts/schema/alert.schema';
import { categories } from 'src/categories/category';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    //@InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>
  ) {}

  async getPosts(
    search: string,
    location: string,
    pageSize: number,
    pageNumber: number,
    userId: string,
    categoryId: string,
  ) {
    if (typeof pageNumber === 'string') {
      pageNumber = parseInt(pageNumber);
    }

    if (typeof pageSize === 'string') {
      pageSize = parseInt(pageSize);
    }

    var result = await this.postModel
      .aggregate([
        {
          $match: {
            $and: [
              {
                title: new RegExp(`.*${search}*`, 'i'), 
                "location.title": new RegExp(`.*${location}*`, 'i'), 
                isDeleted: false,
                categoryId: categoryId,
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'favoriteposts',
            localField: '_id',
            foreignField: 'postId',
            as: 'favPosts',
          },
        },
        {
          $skip: (pageNumber - 1) * pageSize,
        },
        {
          $limit: pageSize,
        },
        {
          $sort: {
            createdOn: -1,
          },
        },
      ])
      .exec();

    result.forEach((post) => {
      if (post.favPosts.length > 0) {
        post.isFavorite = post.favPosts.find((x) => x.userId == userId) !== -1;
      } else {
        post.isFavorite = false;
      }
    });

    const filter: any = { isDeleted: false };

    if (search && search != ".") {
      filter.title = { $regex: new RegExp(this.escapeRegex(search), 'gi') };
    }

    if (location && location != ".") {
      filter['location.title'] = {
        $regex: new RegExp(this.escapeRegex(location), 'gi'),
      };
    }

    const count = await this.postModel.find(filter).countDocuments();

    return {
      count,
      result,
    };
  }

  escapeRegex(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
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
      creatorId: tokenData.user.id,
      createdBy: tokenData.user.name,
      createdOn: new Date(new Date().toUTCString()),
      modifiedByUsername: tokenData.user.username,
      modifiedBy: tokenData.user.name,
      modifiedOn: new Date(new Date().toUTCString()),
    });

    // var usernameList = [];

    // var alerts = await this.alertModel.find({categoryId: categoryId}).exec();
    // if (alerts) {
    //   alerts.forEach(element => {
    //     usernameList.push(element.createdByUsername);
    //   });

    // }

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

  async myPost(username: any): Promise<Array<PostDocument>> {
    const post = await this.postModel
      .find({ createdByUsername: username, isDeleted: false })
      .exec();
    return post;
  }
}
