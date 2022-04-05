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
  sender: string;

  @IsString()
  reciever: string;

  @IsObject()
  message: Message;
}
