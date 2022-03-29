import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Post {
  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  condition: number;

  @Prop({ required: true })
  attachmentUrls: string[];

  @Prop({ required: true })
  description: string;
}
