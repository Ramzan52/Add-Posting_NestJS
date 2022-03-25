import { Injectable } from '@nestjs/common';
// import { isUUID } from 'class-validator';
import { Profile } from './profile.modal';
import { v1 as uuid } from 'uuid';
import { EditProfileDto } from './dto/edit-profile.dto';
@Injectable()
export class ProfileService {
  private profile: Profile = {
    email: 'abc@example.com',
    name: 'Example',
    phoneNo: '03331234567',
    profileId: uuid(),
    profilePic:
      'https://unsplash.com/photos/z3htkdHUh5w?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink',
  };

  getProfile(): Profile {
    return this.profile;
  }
  editprofile(editProfileDto: EditProfileDto) {
    const { name, profilePic, phoneNo, email } = editProfileDto;
    this.profile.name = name;
    this.profile.email = email;
    this.profile.phoneNo = phoneNo;
    this.profile.profilePic = profilePic;
  }
}
