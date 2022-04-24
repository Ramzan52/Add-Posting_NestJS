import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FirebaseNotificationDocument = PostFirebaseNotification & Document;

@Schema()
export class PostFirebaseNotification {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  payLoad: any;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  sentOn: Date;
}

export const NotificationFirebaseSchema = SchemaFactory.createForClass(
  PostFirebaseNotification,
);
