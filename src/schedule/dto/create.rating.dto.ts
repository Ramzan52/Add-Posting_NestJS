import { IsNumber, IsString } from 'class-validator';

export class PostRating {
  @IsNumber()
  rating: number;

  @IsString()
  scheduleId: string;

  @IsString()
  comments: string;
}
