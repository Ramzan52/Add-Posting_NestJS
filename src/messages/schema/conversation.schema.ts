import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';
import { Message } from './post.message.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  reciever: string;

  @Prop({ required: true })
  message: Message;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
