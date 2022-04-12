import { AlertDocument } from './schema/alert.schema';
import { CreateAlertDto } from './dto/post-alert.dto';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
@ApiTags('Alert')
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private alertSvc: AlertsService) {}
  @Post()
  saveAlerts(@Body() body: CreateAlertDto, @Req() req: any) {
    return this.alertSvc.saveAlerts(body, req);
  }

  @Delete('/id')
  deleteAlert(@Param('id') id: string) {
    return this.alertSvc.deleteAlert(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async myPosts(@Request() req: any): Promise<Array<AlertDocument>> {
    return await this.alertSvc.myAlert(req.user.username);
  }
}
