import { Schedule, ScheduleDocument } from './schema/post.schedule.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostSchedule } from './dto/create.schedule.dto';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
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
}
