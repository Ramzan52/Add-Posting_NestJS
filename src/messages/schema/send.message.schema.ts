import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
