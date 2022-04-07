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

export class PostMessage {
  @IsString()
  senderId: string;

  @IsString()
  recieverId: string;

  @IsString()
  recieverName: string;

  @IsString()
  senderName: string;

  @IsString()
  text: string;

  @IsString()
  timeStamp: Date;

  @IsObject()
  post: ChatPost;
}
