import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type PostChatDocument = PostChat & Document;

@Schema()
export class PostChat {
  @Prop({ required: true })
  PostId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  attachmentUrls: string[];

  @Prop({ required: true })
  description: string;
}

export const PostChatSchema = SchemaFactory.createForClass(PostChat);
