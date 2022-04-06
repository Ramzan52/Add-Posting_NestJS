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
  sender: string;

  @IsString()
  reciever: string;

  @IsString()
  text: string;

  @IsDate()
  timeStamp: Date;
}
