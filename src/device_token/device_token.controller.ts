import { CreateDeviceTokenDto } from './dto/post.device.token';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { DeviceTokenService } from './device_token.service';
import {
  Body,
  Controller,
  Get,
  UseGuards,
  Post,
  Request,
} from '@nestjs/common';

@Controller('device-token')
@ApiTags('device-token')
export class DeviceTokenController {
  constructor(private deviceSvc: DeviceTokenService) {}
  @Post()
  postDeviceToken(@Request() req: any, @Body() body: CreateDeviceTokenDto) {
    this.deviceSvc.postDeviceToken(req.user.username, body);
  }
  @Get()
  getToken() {
    this.deviceSvc.sendNotification(
      'fWn9AKhHQMe5y0unzams8K:APA91bFuWIb_ml53GQJA9mdPVP-MbyJwGNWf-NmV0FoAHcZYQneX4tmvH1j7nVwc384kIXAxe_EqRpxf5CwSYfMhUd0uta8RBPhGCiA1IVp5RPYQITPr_DIKJOg6oeQ0MYNN23dxA8bb',
    );
  }
}
