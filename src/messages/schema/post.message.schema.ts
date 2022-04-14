import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';
import { Post } from 'src/posts/schemas/post.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  senderId: string;

  @Prop()
  recieverId: string;

  @Prop()
  recieverName?: string;

  @Prop()
  senderName?: string;

  @Prop()
  text?: string;

  @Prop()
  type?: string;

  @Prop()
  isRead?: boolean = false;

  @Prop()
  timeStamp: Date;

  @Prop()
  post: Post;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
