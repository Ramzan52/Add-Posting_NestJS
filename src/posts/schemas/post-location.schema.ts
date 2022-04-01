import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class PostLocationSchema {
  @Prop()
  title: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}
