import { profile } from 'console';
import { PostRating } from './dto/create.rating.dto';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostSchedule } from './dto/create.schedule.dto';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import admin from 'firebase-admin';
import {
  DeviceToken,
  DeviceTokenDocument,
} from 'src/device_token/schema/device_token.schema';
import { Firebase_NotificationService } from 'src/firebase_notification/firebase_notification.service';
import { mongo } from 'mongoose';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { Profile, ProfileDocument } from 'src/profile/schemas/profile.schema';
import { scheduled } from 'rxjs';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { DeviceTokenService } from 'src/device_token/device_token.service';
import e from 'express';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(DeviceToken.name)
    private readonly deviceTokenModal: Model<DeviceTokenDocument>,
    private readonly firebaseSvc: Firebase_NotificationService,
    private sasSvc: AzureSASServiceService,
    private serviceBusSvc: AzureServiceBusService,
    private DeviceTokenSvc: DeviceTokenService,
  ) {}

  async getSchedule(id: string) {
    let scheduleAsVendor = await this.scheduleModel.aggregate([
      {
        $match: {
          vendorId: id,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'posts',
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);

    let scheduleAsBuyer = await this.scheduleModel
      .aggregate([
        {
          $match: {
            $or: [{ buyerId: id, vendorId: id }],
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            as: 'posts',
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
      ])
      .exec();

    // if (!scheduleAsVendor && !scheduleAsBuyer) {
    //   throw new NotFoundException('No schedule found');
    // }
    let result = [...scheduleAsBuyer];

    return {
      result: result.sort(function (a, b) {
        var date1 = new Date(a);
        var date2 = new Date(b);
        if (date1.valueOf() - date2.valueOf() > 0) {
          return 1;
        } else if (date1.valueOf() - date2.valueOf() == 0) {
          return 0;
        }
      }),
      sas: this.sasSvc.getNewSASKey(),
    };
  }
  async PostSchedule(id: string, dto: PostSchedule) {
    let post = await this.postModel.findOne({
      isDeleted: false,
      _id: dto.postId,
    });
    if (!post) {
      throw new NotFoundException('No Post Found');
    }
    if (post.creatorId != id) {
      throw new UnauthorizedException();
    }
    let data = {
      buyerId: dto.buyerId,
      date: dto.date,
      vendorId: id,
      postId: new mongo.ObjectId(dto.postId),
      time: dto.time,
      createdOn: new Date(),
    };
    let Schedule = await this.scheduleModel.create(data);
    Schedule.save();
    let message = {
      Schedule: Schedule,
      text: `A schedule has been created against ${post.title}  on ${Schedule.date} ${Schedule.time}`,
    };
    await this.findDeviceToken(dto.buyerId, message);
    // await this.findDeviceToken(data.vendorId, message);
    return Schedule;
  }
  async postScheduleRating(dto: PostRating, id: string) {
    let today = new Date();
    let Schedule = await this.scheduleModel.findOne({ _id: dto.scheduleId });

    if (!Schedule) {
      throw new NotFoundException('No Schedule Found');
      console.log('No Schedule Found');
    }

    if (Schedule.date > today || Schedule.time > today) {
      throw new BadRequestException('Schedule is not complete yet');
    }
    if (dto.rating > 5 || dto.rating < 0) {
      throw new BadRequestException('Rating should be between 0 and 5');
    }
    if (Schedule.rating.find((x) => x.userId === id)) {
      throw new BadRequestException('Schedule is already being rated by you');
    }
    if (id === Schedule.vendorId) {
      Schedule.rating.push({
        userId: id,
        ratingId: Schedule.buyerId,
        rating: dto.rating,
        comments: dto.comments,
      });

      const user = await this.userModel.findById(Schedule.buyerId);
      const profile = await this.profileModel.findOne({
        userId: Schedule.buyerId,
      });
      if (user) {
        user.avgRating =
          ((user.ratingsCount || 0) * (user.avgRating || 0) + dto.rating) /
          ((user.ratingsCount || 0) + 1);
        user.ratingsCount = (user.ratingsCount || 0) + 1;
        profile.avgRating = user.avgRating;
        profile.save();
        user.save();
        Schedule.save();
      }
    } else if (id === Schedule.buyerId) {
      Schedule.rating.push({
        userId: id,
        ratingId: Schedule.vendorId,
        rating: dto.rating,
        comments: dto.comments,
      });

      Schedule.save();
      const user = await this.userModel.findById(Schedule.vendorId);
      const profile = await this.profileModel.findOne({
        userId: Schedule.vendorId,
      });
      if (user) {
        user.avgRating =
          ((user.ratingsCount || 0) * (user.avgRating || 0) + dto.rating) /
          ((user.ratingsCount || 0) + 1);
        user.ratingsCount = (user.ratingsCount || 0) + 1;
        profile.avgRating = user.avgRating;
        profile.save();
        user.save();
        await this.serviceBusSvc.sendUpdateDocMessage({
          messageType: 'rating',
          message: profile,
        });
      }
    }
  }

  async findDeviceToken(id: string, message: any) {
    let fcmToken = await this.deviceTokenModal.find({ userId: id });
    if (fcmToken.length > 0) {
      for (let token of fcmToken) {
        let payload: admin.messaging.Message = {
          data: {
            message: JSON.stringify(message),
            type: 'new-schedule',
          },
          token: token.token,
        };
        try {
          admin
            .messaging()
            .send(payload)
            .then((response) => {
              console.log('send schedule');
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
          console.log('schedule', e);
        }
      }
    }
  }
}
