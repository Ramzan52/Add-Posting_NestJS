import { Category } from '../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {
  @Prop({ required: true })
  buyerId: string;

  @Prop({ required: true })
  vendorId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  rating: number;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
