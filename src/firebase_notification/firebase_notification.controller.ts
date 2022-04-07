import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { Firebase_NotificationService } from './firebase_notification.service';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { PostNotification } from './dto/post.notification';

@ApiTags('firebase-notification')
@Controller('firebase-notification')
@UseGuards(JwtAuthGuard)
export class FirebaseNotificationController {
  constructor(private readonly notificationSvc: Firebase_NotificationService) {}
  @Get()
  async getNotifications(
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number,
    @Req() req: any,
  ) {
    let notification = await this.notificationSvc.getNotifications(
      req.user.id,
      pageSize,
      pageNumber,
    );
    if (notification) {
      return notification;
    }
    throw new NotFoundException('no notification found');
  }
}
