import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { categories } from './category';
import { CategoryModel } from './models/category.model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesSvc: CategoriesService) {}

  @Get()
  getCategories(): CategoryModel[] {
    return this.categoriesSvc.getCategories();
  }
}
