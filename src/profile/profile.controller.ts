import { Body, Controller, Get, Put } from '@nestjs/common';
import { Profile } from './profile.modal';
import { ProfileService } from './profile.service';
import { EditProfileDto } from './dto/edit-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Get('myProfile')
  getProfile(): Profile {
    return this.profileService.getProfile();
  }
  @Put('editProfile')
  editProfile(@Body() editprofileDto: EditProfileDto) {
    return this.profileService.editprofile(editprofileDto);
  }
}
