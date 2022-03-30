import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryModel } from './models/category.model';
import { Category, CategoryDocument } from './schemas/category.schema';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  getCategories(): Promise<Array<CategoryDocument>> {
    return this.categoryModel.find().exec();
  }
}
