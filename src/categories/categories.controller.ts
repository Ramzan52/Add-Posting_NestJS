import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryModel } from './models/category.model';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesSvc: CategoriesService) {}

  @Get()
  getCategories() {
    return this.categoriesSvc.getCategories();
  }
}
