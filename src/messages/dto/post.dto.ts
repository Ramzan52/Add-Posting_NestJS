import { IsArray, IsString } from 'class-validator';

export class ChatPost {
  @IsString()
  postId: string;

  @IsString()
  title: string;

  @IsArray()
  attachmentUrls: string[];

  @IsString()
  description: string;

  @IsString()
  postDate: Date;
}
