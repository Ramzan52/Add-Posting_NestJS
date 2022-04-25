import { IsObject, IsString } from 'class-validator';

export class PostNotification {
  @IsString()
  userId: string;

  @IsString()
  type: string;

  @IsObject()
  payLoad: any;

  @IsString()
  sentOn: Date;
}
