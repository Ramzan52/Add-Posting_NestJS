import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  salt: string;

  @Prop({ required: true })
  hash: string;

  @Prop()
  ratingsCount: number = 0;

  @Prop()
  avgRating: number = 0;

  @Prop()
  resetPasswordCode: number;

  @Prop()
  isResetVerified: boolean = false;

  @Prop()
  registerCode: number;

  @Prop()
  isUserVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
