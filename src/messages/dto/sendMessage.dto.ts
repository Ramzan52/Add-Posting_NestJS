import { PostChat } from './../schema/post.schema';
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

export class SendMessage {
  @IsString()
  senderId: string;

  @IsString()
  recieverId: string;

  @IsString()
  text: string;
}
