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

export class PostNotification {
  @IsString()
  username: string;

  @IsString()
  type: string;

  @IsString()
  payLoad: string;

  @IsDate()
  sentOn: Date;
}
