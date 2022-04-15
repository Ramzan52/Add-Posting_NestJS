import { IsNumber, IsString } from 'class-validator';

export class UpdateResetPassword {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
