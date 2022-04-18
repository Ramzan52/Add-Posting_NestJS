import { PostLocationDto } from './../../posts/dto/post-location.dto';
import {
  IsArray,
  IsNotEmptyObject,
  isNumber,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateAlertDto {
  @IsString()
  categoryID: string;

  @IsNumber()
  radius: number;

  @IsNotEmptyObject()
  @ValidateNested()
  location: PostLocationDto;
}
