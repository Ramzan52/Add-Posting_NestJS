import { Category } from './../../categories/schemas/category.schema';
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
  categoryId: Category;

  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  condition: number;

  @IsArray()
  attachmentUrls: string[];

  @IsString()
  description: string;

  @IsNotEmptyObject()
  @ValidateNested()
  location: PostLocationDto;
}
