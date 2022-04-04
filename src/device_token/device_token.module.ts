import { DeviceTokenController } from './device_token.controller';
import { DeviceToken, DeviceTokenSchema } from './schema/device_token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DeviceTokenService } from './device_token.service';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceToken.name, schema: DeviceTokenSchema },
    ]),
  ],
  controllers: [DeviceTokenController],
  providers: [DeviceTokenService, AzureSASServiceService],
})
export class DeviceTokenModule {}
