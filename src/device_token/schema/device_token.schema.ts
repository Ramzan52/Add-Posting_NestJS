import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type DeviceTokenDocument = DeviceToken & Document;

@Schema()
export class DeviceToken extends BaseSchema {
  @Prop({ required: true })
  token: string;
}

export const DeviceTokenSchema = SchemaFactory.createForClass(DeviceToken);
