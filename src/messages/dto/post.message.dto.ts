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
  recieverId: string;

  @IsString()
  postId: string;
}
