import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  senderId: string;

  @Prop()
  receiverId: string;

  @Prop()
  receiverName?: string;

  @Prop()
  senderName?: string;

  @Prop()
  receiverImage?: string;

  @Prop()
  senderImage?: string;

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

  @Prop({ isRequired: false })
  postId?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
