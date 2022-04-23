import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
import { Injectable } from '@nestjs/common';
import { UpdateDocumentMessage } from './models/UpdateDocumentMessage';

// name of the queue
const queueName = 'emails';

@Injectable()
export class AzureServiceBusService {
  constructor(
    private emailSender: ServiceBusSender,
    private updateDocSender: ServiceBusSender,
  ) {
    const client = new ServiceBusClient(
      process.env.SERVICE_BUS_CONNECTION_STRING,
    );

    this.emailSender = client.createSender(queueName);
    this.updateDocSender = client.createSender(
      process.env.UPDATE_DOC_QUEUE_NAME,
    );
  }

  async sendEmail(messageBody: any) {
    await this.emailSender.sendMessages([
      {
        body: messageBody,
        contentType: 'application/json',
      },
    ]);
  }

  sendUpdateDocMessage(message: UpdateDocumentMessage) {
    this.updateDocSender.sendMessages([
      {
        body: message,
        contentType: 'application/json',
      },
    ]);
  }
}
