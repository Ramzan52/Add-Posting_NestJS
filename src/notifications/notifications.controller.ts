import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationModal } from './notification.modal';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  @Get('getAll')
  getNotifications(): NotificationModal[] {
    return this.notificationsService.getNotifications();
  }
}
