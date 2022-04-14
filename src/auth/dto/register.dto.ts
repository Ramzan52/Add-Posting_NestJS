import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;
}
