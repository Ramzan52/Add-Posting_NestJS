import { Module } from '@nestjs/common';

import { AzureSASServiceService } from './azure-sasservice.service';

@Module({
  providers: [AzureSASServiceService],
  // controllers: [AzureSASServiceController],
})
export class AzureSASServiceModule {}
