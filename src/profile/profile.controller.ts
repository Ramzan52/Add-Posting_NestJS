import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { SaveProfileDto } from './dto/save-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './schemas/profile.schema';

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
