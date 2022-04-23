import { IsString } from 'class-validator';

export class SendMessage {
  @IsString()
  senderId?: string;

  @IsString()
  receiverId: string;

  @IsString()
  text: string;

  @IsString()
  type: string;
}
