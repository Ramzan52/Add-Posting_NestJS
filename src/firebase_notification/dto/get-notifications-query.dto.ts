import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { toNumber } from 'src/common/helper/cast.helper';

export class GetNotificationsQueryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  pageNumber = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  pageSize = 10;
}
