import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  recieverId: string;

  @Prop()
  recieverName?: string;

  @Prop({ required: true })
  senderName?: string;

  // @Prop({ required: true })
  // text: string;

  @Prop({ required: true })
  timeStamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
