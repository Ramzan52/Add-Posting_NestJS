import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationModel } from './models/notification.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(): NotificationModel[] {
    return this.notificationsService.getNotifications();
  }
}
