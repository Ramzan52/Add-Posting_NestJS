import { Category } from './../../categories/schemas/category.schema';
import { BaseSchema } from 'src/models/base-document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';

export type AlertDocument = Alert & Document;

@Schema()
export class Alert extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: Category;

  @Prop({ required: true })
  location: PostLocationSchema;

  @Prop({ required: true })
  radius: string;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
