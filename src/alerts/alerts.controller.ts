import { CreateAlertDto } from './dto/post-alert.dto';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Alert')
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private alertSvc: AlertsService) {}
  @Post()
  saveAlerts(@Body() body: CreateAlertDto) {
    return this.alertSvc.saveAlerts(body);
  }
  @Delete()
  deleteAlert(@Param() id: string) {
    return this.alertSvc.deleteAlert(id);
  }
}
