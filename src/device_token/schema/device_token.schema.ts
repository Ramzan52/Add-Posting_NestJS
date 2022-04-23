import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceTokenDocument = DeviceToken & Document;

@Schema()
export class DeviceToken {
  @Prop({ required: true })
  token: string;
  @Prop({ required: true })
  userId: string;
}

export const DeviceTokenSchema = SchemaFactory.createForClass(DeviceToken);
