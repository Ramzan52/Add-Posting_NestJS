import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber } from 'src/common/helper/cast.helper';

export class GetPostsQueryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  pageNumber = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  pageSize = 10;

  @IsString()
  @IsOptional()
  location = '';

  @IsString()
  @IsOptional()
  search = '';

  @IsString()
  @IsOptional()
  categoryId = '';
}
