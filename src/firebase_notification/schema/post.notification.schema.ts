import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type NotificationDocument = PostNotification & Document;

@Schema()
export class PostNotification extends BaseSchema {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  payLoad: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  sentOn: Date;
}

export const NotificationSchema =
  SchemaFactory.createForClass(PostNotification);
