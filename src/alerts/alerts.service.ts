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
  async saveAlerts(dto: CreateAlertDto) {
    const alert = new this.alertModel(CreateAlertDto);
    return alert.save();
  }
  async deleteAlert(id: string) {
    const alert = await this.getAlertByID(id);
    alert.isDeleted = true;
    alert.save();
  }
  async getAlertByID(id: string): Promise<any> {
    try {
      const alert = await this.alertModel.findById(id);
    } catch {
      throw new NotFoundException(`Alert with id ${id} Not Found`);
    }
    if (!alert) {
      throw new NotFoundException(`Alert with id ${id} Not Found`);
    }
    return alert;
  }
}
