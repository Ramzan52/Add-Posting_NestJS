import { CreateDeviceTokenDto } from './dto/post.device.token';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { DeviceTokenService } from './device_token.service';
import { Body, Controller, UseGuards, Post, Req } from '@nestjs/common';
@UseGuards(JwtAuthGuard)
@Controller('device-token')
@ApiTags('device-token')
export class DeviceTokenController {
  constructor(private deviceSvc: DeviceTokenService) {}
  @Post()
  postDeviceToken(@Req() req: any, @Body() body: CreateDeviceTokenDto) {
    return this.deviceSvc.postDeviceToken(req.user.id, body);
  }
  @Post('/delete')
  deleteDeviceToken(@Req() req: any, @Body() body: CreateDeviceTokenDto) {
    return this.deviceSvc.deleteDeviceToken(req.user.id, body);
  }
}
