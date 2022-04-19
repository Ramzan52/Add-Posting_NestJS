import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { AlertsService } from 'src/alerts/alerts.service';
import { calcCrow } from 'src/common/helper/calculate.distance';
import {
  DeviceToken,
  DeviceTokenDocument,
} from 'src/device_token/schema/device_token.schema';
import { FcmTOkenService } from 'src/messages/fcmNotification.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModel: Model<DeviceTokenDocument>,
    private readonly alertSvc: AlertsService,
    private readonly fcmSvc: FcmTOkenService,
  ) {}

  async getPosts(
    search: string,
    location: string,
    pageSize: number,
    pageNumber: number,
    userId: string,
    categoryId: string,
  ) {
    const countFilter: any = { isDeleted: false };
    const aggregateFilters: any[] = [
      {
        isDeleted: false,
      },
    ];

    if (search) {
      aggregateFilters.push({ title: new RegExp(`.*${search}*`, 'i') });
      countFilter.title = {
        $regex: new RegExp(this.escapeRegex(search), 'gi'),
      };
    }

    if (location) {
      aggregateFilters.push({
        'location.title': new RegExp(`.*${location}*`, 'i'),
      });
      countFilter['location.title'] = {
        $regex: new RegExp(this.escapeRegex(location), 'gi'),
      };
    }

    if (categoryId) {
      aggregateFilters.push({ categoryId: new mongo.ObjectId(categoryId) });
      countFilter.categoryId = new mongo.ObjectId(categoryId);
    }

    const result = await this.postModel
      .aggregate([
        {
          $match: {
            $and: aggregateFilters,
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
            modifiedOn: -1,
          },
        },
      ])
      .exec();

    result.forEach(
      (post) =>
        (post.isFavorite =
          post.favPosts.length > 0 &&
          post.favPosts.findIndex((x) => x.userId === userId) !== -1),
    );

    const count = await this.postModel.find(countFilter).countDocuments();

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

    // var alerts = await this.alertSvc.find(categoryId);

    // console.log({ alerts });

    // alerts.forEach((alert) => {
    //   var distance = calcCrow(
    //     post.location.latitude,
    //     post.location.longitude,
    //     alert.location.latitude,
    //     alert.location.longitude,
    //   );
    //   if (distance <= alert.radius) {
    //     usernameList.push(alert.userId);
    //   }
    // });

    // const records = await this.deviceTokenModel.find({
    //   userId: { $in: usernameList },
    // });

    // let tokenList = [];

    // records.map((record) => {
    //   tokenList.push(record.token);
    // });

    // console.log({ records });

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
