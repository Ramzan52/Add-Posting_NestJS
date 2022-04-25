import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;
@Schema()
export class Notification {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  picture: string;

  @Prop({ required: true })
  time: Date;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
