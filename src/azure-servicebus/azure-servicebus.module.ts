import { Module } from '@nestjs/common';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';

@Module({
  providers: [AzureSASServiceService],
})
export class AzureServiceBusModule {}
