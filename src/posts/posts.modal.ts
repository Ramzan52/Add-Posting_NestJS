import { PostLocation } from './postLocation.modal';
export interface PostModal {
  categoryId: string;
  location: PostLocation;
  attachmentUrls: string[];
  condition: number;
  title: string;
  description: string;
  isDelete: boolean;
  isActive: boolean;
  isVend: boolean;
}
