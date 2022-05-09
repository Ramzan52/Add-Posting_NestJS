import { IsOptional, IsString } from 'class-validator';

export class SaveProfileDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  profilePic: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
