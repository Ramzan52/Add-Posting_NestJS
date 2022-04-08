import { IsNumber, IsString } from 'class-validator';

export class ResetPassword {
  @IsString()
  email: string;
}
