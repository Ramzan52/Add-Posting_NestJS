import { PostRating } from './dto/create.rating.dto';
import { Schedule, ScheduleDocument } from './schema/post.schedule.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostSchedule } from './dto/create.schedule.dto';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getSchedule(id: string): Promise<Array<PostSchedule>> {
    let Schedule = await this.scheduleModel.find({
      buyerId: id,
      vendorId: id,
    });
    if (!Schedule) {
      throw new NotFoundException('No schendule found');
    }
    return Schedule;
  }
  async PostSchedule(id: String, dto: PostSchedule) {
    let post = await this.postModel.find({ isDeleted: false, _id: dto.postId });
    if (!post) {
      throw new NotFoundException('No Post Found');
    }
    let data = {
      buyerId: dto.buyerId,
      date: dto.date,
      vendorId: id,
      postId: dto.postId,
      time: dto.time,
    };
    let Schedule = await this.scheduleModel.create(data);
    Schedule.save();
    return Schedule;
  }
  async postScheduleRating(dto: PostRating) {
    let today = new Date();
    let Schedule = await this.scheduleModel.findById(dto.scheduleId);

    if (!Schedule) {
      throw new NotFoundException('No Schedule Found');
    }
    if (Schedule.date < today || Schedule.time < today) {
      throw new NotFoundException('No Schedule Found');
    }
    if (dto.rating > 5 || dto.rating < 0) {
      throw new NotFoundException('Rating should be between 0 and 5');
    }

    let user = await this.userModel.findById(dto.vednorId);
    user.ratings.push({
      postId: dto.postId,
      scheduleId: dto.scheduleId,
      rating: dto.rating,
    });
    var totalRatings = 0;
    user.ratings.map((rating) => {
      totalRatings += rating.rating;
    });
    user.avgRating = totalRatings / user.ratings.length;
    user.save();
    return user;
  }
}
