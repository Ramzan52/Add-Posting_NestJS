import { IsNotEmpty, min } from 'class-validator';
import { PostLocation } from '../postLocation.modal';

export class CreatePostsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  condition: number;

  @IsNotEmpty()
  attachmentUrls: string[];

  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  location: PostLocation;
}
