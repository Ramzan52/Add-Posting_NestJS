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
  senderId: string;

  @IsString()
  recieverId: string;

  @IsObject()
  post: ChatPost;
}
