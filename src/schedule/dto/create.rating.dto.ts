import { Schedule } from './../schema/post.schedule.schema';
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
  @IsString()
  vednorId: string;

  @IsString()
  postId: string;

  @IsNumber()
  rating: number;

  @IsString()
  scheduleId: string;
}
