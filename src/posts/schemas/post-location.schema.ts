import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class PostLocationSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}
