import { IsNumber, IsString } from 'class-validator';

export class VerifyResetPassword {
  // @IsString()
  // username: string;

  @IsNumber()
  code: number;

  @IsString()
  password: string;
}
