import { IsString } from 'class-validator';

export class PostFirstMessage {
  @IsString()
  receiverId: string;

  @IsString()
  postId: string;

  @IsString()
  latestText?: string;
}
