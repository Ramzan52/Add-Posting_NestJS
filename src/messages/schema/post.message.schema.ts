import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  reciever: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  timeStamp: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
