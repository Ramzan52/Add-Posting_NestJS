import {
  IsArray,
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

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

  @IsDate()
  timeStamp: Date;
}
