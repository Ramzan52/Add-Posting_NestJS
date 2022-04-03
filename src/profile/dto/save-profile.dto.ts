import { IsOptional, IsString } from 'class-validator';

export class SaveProfileDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  profilePic: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
