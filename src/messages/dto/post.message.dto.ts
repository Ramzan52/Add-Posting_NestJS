import { Prop } from '@nestjs/mongoose';
import {
  IsArray,
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ChatPost } from './post.dto';

export class PostFirstMessage {
  @Prop({required: true})
  recieverId: string;

  @Prop({required: true})
  postId: string;
}
