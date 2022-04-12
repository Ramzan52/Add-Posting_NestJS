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
    @Req() req: any,
    @Query('pageSize') pageSize?: number,
    @Query('pageNumber') pageNumber?: number,
  ) {
    if (pageNumber == null || pageNumber < 1) pageNumber = 1;
    if (pageSize == null || pageSize < 1) pageSize = 10;

    return await this.notificationSvc.getNotifications(
      req.user.id,
      pageSize,
      pageNumber,
    );
    // if (notification) {
    //   return notification;
    // }
    // throw new NotFoundException('no notification found');
  }
}
