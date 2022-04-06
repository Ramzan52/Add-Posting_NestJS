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
import { Message } from '../schema/post.message.schema';

export class PostConversation {
  @IsString()
  senderId: string;

  @IsString()
  recieverId: string;

  @IsString()
  senderName: string;

  @IsString()
  recieverName: string;

  @IsObject()
  message: Message;
}
