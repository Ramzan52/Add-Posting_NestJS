import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class PostLocationSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}
