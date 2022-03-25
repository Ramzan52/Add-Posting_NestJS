import { PostLocationDto } from '../dto/post-location.dto';

export interface PostModel {
  id: string;
  categoryId: string;
  category: string;
  location: PostLocationDto;
  attachmentUrls: string[];
  condition: number;
  title: string;
  description: string;
  isDeleted: boolean;
  isActive: boolean;
  isVend: boolean;
}
