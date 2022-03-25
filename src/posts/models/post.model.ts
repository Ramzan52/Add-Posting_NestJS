import { BaseModel } from 'src/models/base-document.model';
import { PostLocationDto } from '../dto/post-location.dto';

export interface PostModel extends BaseModel {
  categoryId: string;
  category: string;
  location: PostLocationDto;
  attachmentUrls: string[];
  condition: number;
  title: string;
  description: string;
  isActive: boolean;
  isVend: boolean;
}
