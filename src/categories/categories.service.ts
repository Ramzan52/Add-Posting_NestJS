import { Injectable } from '@nestjs/common';
import { categories } from './category';
import { CategoryModel } from './models/category.model';

@Injectable()
export class CategoriesService {
  private categories = categories;
  getCategories(): CategoryModel[] {
    return this.categories;
  }
}
