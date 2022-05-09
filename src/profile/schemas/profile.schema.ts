import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ required: true })
  name: string;

  @Prop()
  profilePic: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  avgRating?: number = 0;

  @Prop()
  generalNotification: boolean = true;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
