import { IsString } from 'class-validator';

export class CreateDeviceTokenDto {
  @IsString()
  token: string;
}
