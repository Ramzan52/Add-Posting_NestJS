import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { SaveProfileDto } from './dto/save-profile.dto';
import { ProfileService } from './profile.service';
import { Profile } from './schemas/profile.schema';
import { GetProfileDto } from './dto/get-profile.dto';
import { AzureSASServiceService } from '../azure-sasservice/azure-sasservice.service';

@ApiTags('profile')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private profileSvc: ProfileService,
    private sasSvc: AzureSASServiceService,
  ) {}

  @Get()
  @ApiOkResponse({ status: 200, type: GetProfileDto })
  async getProfile(@Request() req): Promise<GetProfileDto> {
    console.log('getProfile', req.user);
    const profile = await this.profileSvc.findOne(req.user.username);
    return {
      id: profile._id,
      name: profile.name,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      profilePic: profile.profilePic,
      sas: this.sasSvc.getNewSASKey(),
    };
  }

  @Post()
  saveProfile(@Request() req, @Body() body: SaveProfileDto) {
    return this.profileSvc.editProfile(req.user.username, body);
  }
}
