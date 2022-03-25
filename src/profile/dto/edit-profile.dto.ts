import { IsNotEmpty } from 'class-validator';
export class EditProfileDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  profilePic: string;
  @IsNotEmpty()
  phoneNo: string;
  @IsNotEmpty()
  email: string;
}
