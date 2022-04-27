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
    ]);

    let scheduleAsBuyer = await this.scheduleModel.aggregate([
      {
        $match: {
          buyerId: id,
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
    ]);

    if (!scheduleAsVendor && !scheduleAsBuyer) {
      throw new NotFoundException('No schedule found');
    }
    var result = [...scheduleAsBuyer, ...scheduleAsVendor];

    return {
      result: result,
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
    };
    let Schedule = await this.scheduleModel.create(data);
    Schedule.save();
    let message = {
      Schedule: Schedule,
      text: `A schedule has been created against ${post.title}  on ${Schedule.date} ${Schedule.time}`,
    };
    await this.findDeviceToken(dto.buyerId, message);
    await this.findDeviceToken(data.vendorId, message);
    return Schedule;
  }
  async postScheduleRating(dto: PostRating) {
    let today = new Date();
    let Schedule = await this.scheduleModel.findOne({ _id: dto.scheduleId });

    if (!Schedule) {
      throw new NotFoundException('No Schedule Found');
    }
    if (Schedule.rating) {
      return;
    }

    if (Schedule.date > today || Schedule.time > today) {
      throw new BadRequestException('Schedule is not complete yet');
    }
    if (dto.rating > 5 || dto.rating < 0) {
      throw new BadRequestException('Rating should be between 0 and 5');
    }

    Schedule.rating = dto.rating;
    Schedule.comments = dto.comments;
    const user = await this.userModel.findById(Schedule.vendorId);
    const profile = await this.profileModel.findOne({
      userId: Schedule.vendorId,
    });

    user.avgRating =
      ((user.ratingsCount || 0) * (user.avgRating || 0) + dto.rating) /
      ((user.ratingsCount || 0) + 1);
    user.ratingsCount = (user.ratingsCount || 0) + 1;
    if (profile) profile.avgRating = user.avgRating;
    if (profile) await profile.save();
    await user.save();
    await Schedule.save();
  }

  async findDeviceToken(id: string, message: any) {
    let fcmToken = await this.deviceTokenModal.findOne({ userId: id });
    if (fcmToken && fcmToken.token !== null) {
      let payload: admin.messaging.Message = {
        data: { message: JSON.stringify(message), type: 'new-schedule' },
        token: fcmToken.token,
      };
      admin.messaging().send(payload);
      // this.firebaseSvc.PostNotification({
      //   type: 'new-schedule',
      //   payLoad: message,
      //   sentOn: new Date(),
      //   userId: id,
      // });
    }
  }
}
