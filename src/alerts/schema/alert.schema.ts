import { PostLocationDto } from './../../posts/dto/post-location.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema()
export class Alert {
  @Prop({ required: true })
  location: PostLocationDto;

  @Prop({ required: true })
  radius: string;

  @Prop({ required: true })
  categoryID: string;

  @Prop({ required: true })
  isDeleted: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
