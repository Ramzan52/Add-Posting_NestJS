import { PostLocationDto } from './../../posts/dto/post-location.dto';
import { IsArray, IsNotEmptyObject, IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  categoryID: string;

  @IsNumber()
  radius: number;

  @IsNotEmptyObject()
  location: PostLocationDto;

  @IsArray()
  keywords: [string];
}
