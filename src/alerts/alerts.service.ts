import { Alert, AlertDocument } from './schema/alert.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAlertDto } from './dto/post-alert.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, mongo } from 'mongoose';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
  ) {}

  async saveAlerts(dto: CreateAlertDto, tokenData: any) {
    const alert = await this.alertModel.create({
      location: dto.location,
      categoryId: new mongo.ObjectId(dto.categoryID),
      radius: dto.radius,
      userId: tokenData.user.id,
      isDeleted: false,
      createdByUsername: tokenData.user.username,
      createdBy: tokenData.user.name,
      createdOn: new Date(new Date().toUTCString()),
      modifiedByUsername: tokenData.user.username,
      modifiedBy: tokenData.user.name,
      modifiedOn: new Date(new Date().toUTCString()),
      keywords: dto.keywords,
    });

    return alert;
  }

  async deleteAlert(id: string) {
    const alert = await this.getAlertByID(id);
    alert.isDeleted = true;
    alert.save();
  }

  async getAlertByID(id: string): Promise<any> {
    const alerts = await this.alertModel.findById(id);
    if (!alerts) {
      throw new NotFoundException(`Alert with id ${id} Not Found`);
    }
    return alerts;
  }

  async myAlert(username: string): Promise<Array<AlertDocument>> {
    let post = await this.alertModel.aggregate([
      {
        $match: {
          userId: username,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'Category',
        },
      },
    ]);
    // const post = await this.alertModel
    //   .find({ createdByUsername: username, isDeleted: false })
    //   .exec();
    return post;
  }

  async find(categoryId: string) {
    const post = await this.alertModel
      .find({ categoryId: categoryId, isDeleted: false })
      .exec();
    return post;
  }

  async findByAggregate(query: any) {
    const post = await this.alertModel.find(query).exec();
    return post;
  }
}
