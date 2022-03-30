import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseSchema } from 'src/models/base-document.schema';
import { Category } from '../../categories/schemas/category.schema';
import { PostLocationSchema } from './post-location.schema';

export type PostDocument = Post & Document;
@Schema()
export class Post extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: Category;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  condition: number;

  @Prop({ required: true })
  attachmentUrls: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ required: true })
  isVend: boolean;

  @Prop({ required: true })
  location: PostLocationSchema;
}
export const PostSchema = SchemaFactory.createForClass(Post);
