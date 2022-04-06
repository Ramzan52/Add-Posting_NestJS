import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type FirebaseNotificationDocument = PostFirebaseNotification & Document;

@Schema()
export class PostFirebaseNotification {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  payLoad: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  sentOn: Date;
}

export const NotificationFirebaseSchema = SchemaFactory.createForClass(
  PostFirebaseNotification,
);
