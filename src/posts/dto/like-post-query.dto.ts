import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { toBoolean } from 'src/common/helper/cast.helper';

export class LikePostQueryDto {
  @IsString()
  postId: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  like: boolean;
}
