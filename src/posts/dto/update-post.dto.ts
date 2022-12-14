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

export class UpdatePostDto {
  @IsString()
  categoryId: Category;

  @IsString()
  id: string;

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
  location: PostLocationDto;
}
