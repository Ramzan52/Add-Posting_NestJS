import { Category } from '../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';
import { Post } from 'src/posts/schemas/post.schema';

export type SendMessageDocument = SendMessage & Document;

@Schema()
export class SendMessage {
  @Prop()
  senderId: string;

  @Prop()
  receiverId: string;

  @Prop()
  text?: string;

  @Prop()
  type?: string;
}

export const SendMessageSchema = SchemaFactory.createForClass(SendMessage);
