import { v1 as uuid } from 'uuid';
import { CategoryModel } from './models/category.model';
export const categories: CategoryModel[] = [
  {
    backgroundColor: '#DCEADE',
    imageUrl:
      'https://unsplash.com/photos/fZuleEfeA1Q?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
    categoryId: uuid(),
    categoryName: 'Furniture',
  },
  {
    backgroundColor: '#FAEADE',
    imageUrl:
      'https://unsplash.com/photos/pm0tuojODh4?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
    categoryId: uuid(),
    categoryName: 'Kitchen',
  },
  {
    backgroundColor: '#DAEBFC',
    imageUrl:
      'https://unsplash.com/photos/FO7JIlwjOtU?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
    categoryId: uuid(),
    categoryName: 'Electronics',
  },
];
