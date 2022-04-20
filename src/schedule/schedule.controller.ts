import { PostRating } from './dto/create.rating.dto';
import { ScheduleService } from './schedule.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
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
    return await this.scheduleSvc.getSchedule(req.user.id);
  }
  @Post()
  async postSchedule(@Req() req: any, @Body() body: PostSchedule) {
    let schedule = await this.scheduleSvc.PostSchedule(req.user.id, body);
    if (schedule) {
      return schedule;
    }
    throw new BadRequestException();
  }
  @Post('/rating')
  @HttpCode(204)
  async postScheduleRating(@Body() body: PostRating) {
    await this.scheduleSvc.postScheduleRating(body);
  }
}
