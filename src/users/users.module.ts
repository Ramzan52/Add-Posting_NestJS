import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { Profile, ProfileSchema } from 'src/profile/schemas/profile.schema';
import { User, UserSchema } from './schemas/user.schema';
import { userController } from './user.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  providers: [UsersService, AzureServiceBusService],
  controllers: [userController],

  exports: [UsersService],
})
export class UsersModule {}
