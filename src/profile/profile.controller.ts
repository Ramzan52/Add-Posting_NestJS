import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { SaveProfileDto } from './dto/save-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './schemas/profile.schema';

@ApiTags('profile')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileSvc: ProfileService) {}

  @Get()
  getProfile(@Request() req): Promise<Profile> {
    console.log('getProfile', req.user);
    return this.profileSvc.findOne(req.user.username);
  }

  @Post()
  saveProfile(@Request() req, @Body() body: SaveProfileDto) {
    return this.profileSvc.editProfile(req.user.username, body);
  }
}
