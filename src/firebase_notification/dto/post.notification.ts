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
  userId: string;

  @IsString()
  type: string;

  @IsString()
  payLoad: string;

  @IsString()
  sentOn: Date;
}
