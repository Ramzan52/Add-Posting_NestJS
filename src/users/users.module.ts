import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AzureServiceBusService } from 'src/azure-servicebus/azure-servicebus.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, AzureServiceBusService],
  exports: [UsersService],
})
export class UsersModule {}
