import { IsString, IsNumber } from 'class-validator';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class UserLocation {
  @IsString()
  title: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
