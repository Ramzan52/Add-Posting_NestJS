import { ScheduleService } from './schedule.service';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { PostSchedule } from './dto/create.schedule.dto';

@ApiTags('schedule')
@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleSvc: ScheduleService) {}

  @Get()
  async getSchedule(@Req() req: any) {
    let schedule = await this.scheduleSvc.getSchedule(req.user.id);
    if (schedule) {
      return schedule;
    }
    throw new InternalServerErrorException();
  }
  @Post()
  async postSchedule(@Req() req: any, @Body() body: PostSchedule) {
    let schedule = await this.scheduleSvc.PostSchedule(req.user.id, body);
    if (schedule) {
      return schedule;
    }
    throw new InternalServerErrorException();
  }
}
