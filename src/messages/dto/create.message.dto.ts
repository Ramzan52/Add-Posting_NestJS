import { IsObject, IsString } from 'class-validator';
import { ChatPost } from './post.dto';

export class PostMessage {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  receiverName: string;

  @IsString()
  senderName: string;

  @IsString()
  text: string;

  @IsString()
  timeStamp: Date;

  @IsObject()
  post: ChatPost;
}
