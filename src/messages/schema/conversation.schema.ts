import { SendMessage } from './../dto/sendMessage.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString } from 'class-validator';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop()
  receiverName?: string;

  @Prop()
  senderName?: string;

  @Prop()
  senderImage?: string;

  @Prop()
  receiverImage?: string;

  @Prop()
  receiverRating?: number;

  @Prop()
  senderRating?: number;

  @Prop()
  message: SendMessage;

  @IsString()
  timeStamp: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
