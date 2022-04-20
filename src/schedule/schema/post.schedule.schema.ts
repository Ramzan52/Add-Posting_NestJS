import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
