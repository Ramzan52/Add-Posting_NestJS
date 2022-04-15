import { IsNumber, IsString } from 'class-validator';

export class ResetPasswordBody {
  
  @IsString()
  email: string;
}
