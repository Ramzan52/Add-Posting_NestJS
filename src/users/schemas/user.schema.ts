import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

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

  @Prop({ required: true })
  location: PostLocationSchema;

  @Prop()
  generalNotification: boolean = true;
}

export const UserSchema = SchemaFactory.createForClass(User);
