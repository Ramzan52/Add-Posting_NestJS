import { Schedule, ScheduleSchema } from './schema/post.schedule.schema';
import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],

  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
