import { Schedule } from '../schema/schedule.schema';
import {
  IsArray,
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { StringifyOptions } from 'querystring';

export class PostRating {
  @IsNumber()
  rating: number;

  @IsString()
  scheduleId: string;

  @IsString()
  comments: string;
}
