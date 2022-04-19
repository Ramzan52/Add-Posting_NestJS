import { PostLocationDto } from './../../posts/dto/post-location.dto';
import { IsNotEmptyObject, IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  categoryID: string;

  @IsNumber()
  radius: number;

  @IsNotEmptyObject()
  location: PostLocationDto;
}
