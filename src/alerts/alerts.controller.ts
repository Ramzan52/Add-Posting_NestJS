import { AlertDocument } from './schema/alert.schema';
import { CreateAlertDto } from './dto/post-alert.dto';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Alert')
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private alertSvc: AlertsService) {}

  @Post()
  saveAlerts(@Req() req: any, @Body() body: CreateAlertDto) {
    body.location = {
      title: body.location.title,
      latitude: parseFloat(body.location.latitude.toFixed(7)),
      longitude: parseFloat(body.location.longitude.toFixed(7)),
    };

    return this.alertSvc.saveAlerts(body, req);
  }

  @Delete()
  deleteAlert(@Query('id') id: string) {
    return this.alertSvc.deleteAlert(id);
  }

  @Get('/my')
  async myAlerts(@Request() req: any): Promise<Array<AlertDocument>> {
    return await this.alertSvc.myAlert(req.user.username);
  }
}
