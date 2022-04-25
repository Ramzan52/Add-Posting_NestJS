import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { GetNotificationsQueryDto } from './dto/get-notifications-query.dto';
import { Firebase_NotificationService } from './firebase_notification.service';

@ApiTags('firebase-notification')
@Controller('firebase-notification')
@UseGuards(JwtAuthGuard)
export class FirebaseNotificationController {
  constructor(private readonly notificationSvc: Firebase_NotificationService) {}
  @Get()
  async getNotifications(
    @Req() req: any,
    @Query() query: GetNotificationsQueryDto,
  ) {
    const { pageNumber, pageSize } = query;

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
  // @Post()
  // async PostNotification(@Body() body: PostNotification) {
  //   this.notificationSvc.PostNotification(body);
  // }
}
