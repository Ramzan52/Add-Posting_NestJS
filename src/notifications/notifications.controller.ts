import { Controller, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/auth-guards';

// @ApiTags('notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Get()
  // async getNotifications() {
  //   return await this.notificationsService.getNotifications();
  // }
}
