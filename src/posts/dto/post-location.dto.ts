import { IsNumber, IsString } from 'class-validator';

export class PostLocationDto {
  @IsString()
  title: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
