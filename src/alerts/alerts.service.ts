import { Alert, AlertDocument } from './schema/alert.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAlertDto } from './dto/post-alert.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
  ) {}

  async saveAlerts(dto: CreateAlertDto, tokenData: any) {
    const alert = await this.alertModel.create({
      location: dto.location,
      categoryId: dto.categoryID,
      radius: dto.radius,
      userId: tokenData.user.id,
      isDeleted: false,
      createdByUsername: tokenData.user.username,
      createdBy: tokenData.user.name,
      createdOn: new Date(new Date().toUTCString()),
      modifiedByUsername: tokenData.user.username,
      modifiedBy: tokenData.user.name,
      modifiedOn: new Date(new Date().toUTCString()),
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
    if (!alert) {
      throw new NotFoundException(`Alert with id ${id} Not Found`);
    }
    return alerts;
  }

  async myAlert(username: string): Promise<Array<AlertDocument>> {
    const post = await this.alertModel
      .find({ createdByUsername: username })
      .exec();
    return post;
  }

  async find(categoryId: string) {
    const post = await this.alertModel.find({ categoryId: categoryId }).exec();
    return post;
  }

  async findByAggregate(query: any) {
    const post = await this.alertModel.find(query).exec();
    return post;
  }
}
