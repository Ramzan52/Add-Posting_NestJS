import { IsNumber, IsString } from 'class-validator';

export class VerifyDto {
  
  @IsString()
  username: string;

  @IsNumber()
  code: number;
}
