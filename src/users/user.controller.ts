import { UserLocation } from './dto/user.location.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostLocationSchema } from 'src/posts/schemas/post-location.schema';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class userController {
  constructor(private readonly userSvc: UsersService) {}

  @Post('/current-location')
  async postCurrentLocation(@Req() req: any, @Body() body: UserLocation) {
    return await this.userSvc.postCurrentLocation(req.user.id, body);
  }

  @Post('/general-notification')
  async postGeneralNotification(
    @Req() req: any,
    @Body() generalNotification: boolean,
  ) {
    return await this.userSvc.postGeneralNotification(
      req.user.id,
      generalNotification,
    );
  }
}
