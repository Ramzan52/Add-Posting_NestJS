import { Prop } from '@nestjs/mongoose';
import {
  IsArray,
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ChatPost } from './post.dto';

export class PostFirstMessage {
  @IsString()
  receiverId: string;

  @IsString()
  postId: string;

  @IsString()
  latestText?: string;
}
