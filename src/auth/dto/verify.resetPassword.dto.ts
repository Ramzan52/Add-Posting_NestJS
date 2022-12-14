import { IsNumber, IsString } from 'class-validator';

export class VerifyResetPassword {
  @IsString()
  email: string;

  @IsNumber()
  code: number;
}
