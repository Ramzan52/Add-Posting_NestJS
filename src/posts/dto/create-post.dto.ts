import {
  IsArray,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PostLocationDto } from './post-location.dto';

export class CreatePostDto {
  @IsString()
  categoryId: string;

  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  condition: number;

  @IsArray()
  attachmentUrls: string[];

  @IsString()
  description: string;

  @IsNotEmptyObject()
  @ValidateNested()
  location: PostLocationDto;
}
