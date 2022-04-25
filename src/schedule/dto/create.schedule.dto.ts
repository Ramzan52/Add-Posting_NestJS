import { IsString } from 'class-validator';

export class PostSchedule {
  @IsString()
  buyerId: string;

  @IsString()
  postId: string;

  @IsString()
  date: Date;

  @IsString()
  time: Date;
}
