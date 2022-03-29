import { PostLocationDto } from './../../posts/dto/post-location.dto';
import {
  IsArray,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateAlertDto {
  @IsString()
  categoryID: string;

  @IsString()
  radius: string;

  @IsNotEmptyObject()
  @ValidateNested()
  location: PostLocationDto;
}
