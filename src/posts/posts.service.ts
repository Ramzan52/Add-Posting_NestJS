import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
import admin from 'firebase-admin';
import { Firebase_NotificationService } from 'src/firebase_notification/firebase_notification.service';
import { Profile, ProfileDocument } from 'src/profile/schemas/profile.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { DeviceTokenService } from 'src/device_token/device_token.service';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModal: Model<DeviceTokenDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    private readonly firebaseSvc: Firebase_NotificationService,

    private readonly alertSvc: AlertsService,
    private readonly fcmSvc: FcmTOkenService,
    private readonly DeviceTokenSvc: DeviceTokenService,
    private serviceBusSvc: AzureServiceBusService,
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
    countFilter.creatorId = {
      $not: {
        $eq: userId,
      },
    };
    const aggregateFilters: any[] = [
      {
        isDeleted: false,
        isVend: false,
        isActive: true,
        creatorId: {
          $not: {
            $eq: userId,
          },
        },
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
      keywords,
    } = dto;
    let user = await this.userModel.findOne({
      username: tokenData.user.username,
    });
    let profile = await this.profileModel.findOne({
      email: tokenData.user.username,
    });

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
      keywords: keywords,
      UserProfile: profile.profilePic,
      UserRating: user.avgRating,
      UserNumber: profile.phoneNumber,
    });

    await this.createObjForNotification(categoryId, post);
    // await this.serviceBusSvc.sendUpdateDocMessage({
    //   messageType: 'post',
    //   message: post,
    // });

    return post;
  }

  private async createObjForNotification(
    categoryId: string,
    post: Post & import('mongoose').Document<any, any, any> & { _id: any },
  ) {
    let usernameList = [];

    let alerts = await this.alertSvc.find(categoryId);
    console.log(alerts);

    for (let alert of alerts) {
      if (alert.userId !== post.creatorId) {
        const commonNames = [];
        alert.keywords.forEach((name) => {
          if (post.keywords.includes(name)) commonNames.push(name);
        });

        let distance = calcCrow(
          post.location.latitude,
          post.location.longitude,
          alert.location.latitude,
          alert.location.longitude,
        );

        if (distance <= alert.radius || commonNames.length > 0) {
          const token = await this.deviceTokenModal
            .findOne({ userId: alert.userId })
            .exec();

          if (token) {
            usernameList.push({
              alert: alert,
              userId: alert.userId,
              token: token.token,
              post: post,
            });
          }
        }
      }
      // usernameList.forEach((x) => {
      //   this.sendNotification(x, post);
      // });
      for (let username of usernameList) {
        await this.sendNotification(username, post);
      }
    }
  }
  async sendNotification(x: any, post: Post) {
    let notificationPayload = {
      alert: x.alert,
      post: post,
    };
    let fcmToken = await this.deviceTokenModal.find({ userId: x.userId });
    if (fcmToken.length > 0) {
      for (let token of fcmToken) {
        let payload: admin.messaging.Message = {
          data: {
            message: JSON.stringify(notificationPayload),
            type: 'new-alert',
          },
          token: token.token,
        };

        try {
          admin
            .messaging()
            .send(payload)
            .then((response) => {
              console.log('send post1111', payload);
            })
            .catch((error) => {
              this.DeviceTokenSvc.deleteToken(token.token, token.userId).then(
                (err) => {
                  console.log(err);
                },
              );
              console.log('error', error);
            });
        } catch (e) {
          console.log('alert', e);
        }
      }
      await this.firebaseSvc.PostNotification({
        type: 'new-alert',
        payLoad: notificationPayload,
        sentOn: new Date(),
        userId: fcmToken[0].userId,
      });
    }
  }

  async getPostDetails(id: string, userId: string) {
    const post = await this.postModel
      .aggregate([
        {
          $match: {
            _id: new mongo.ObjectId(id),
            isDeleted: false,
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
      ])
      .exec();

    if (post.length < 1) {
      throw new NotFoundException(`Post with id ${id} Not Found`);
    }

    post.forEach(
      (post) =>
        (post.isFavorite =
          post.favPosts.length > 0 &&
          post.favPosts.findIndex((x) => x.userId === userId) !== -1),
    );
    return post[0];
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
