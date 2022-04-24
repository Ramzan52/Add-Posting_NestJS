import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, ProfileSchema } from './schemas/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [ProfileService],
  providers: [
    ProfileService,
    AzureSASServiceService,
    UsersService,
    AzureServiceBusService,
  ],
  controllers: [ProfileController],
})
export class ProfileModule {}
