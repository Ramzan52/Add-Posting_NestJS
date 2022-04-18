import { Injectable } from '@nestjs/common';

const { ServiceBusClient } = require('@azure/service-bus');

// connection string to your Service Bus namespace
const connectionString =
  'Endpoint=sb://inserito-basic.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=Ryvwatl9+F8YoOFH0m2/3ULQwdHRR7DxK13Uu31Jpi0=';

// name of the queue
const queueName = 'emails';

@Injectable()
export class AzureServiceBusService {
  private client;
  private emailSender;
  constructor() {
    this.client = new ServiceBusClient(connectionString);
    this.emailSender = this.client.createSender(queueName);
  }

  sendEmail(messageBody: any) {
    this.emailSender.sendMessages([
      {
        body: messageBody,
        contentType: 'application/json',
      },
    ]);
  }
}
