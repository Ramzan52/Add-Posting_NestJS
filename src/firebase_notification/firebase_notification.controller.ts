import { PostNotification } from './schema/post.notification.schema';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { Firebase_NotificationService } from './firebase_notification.service';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';

@ApiTags('firebase-notification')
@Controller('firebase-notification')
@UseGuards(JwtAuthGuard)
export class FirebaseNotificationController {
  constructor(private readonly notificationSvc: Firebase_NotificationService) {}
  @Post()
  postNotification(@Body() body: PostNotification) {
    this.notificationSvc.PostNotification(body);
  }
}
