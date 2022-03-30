import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Multer } from 'multer';
// import { Express } from 'express';
@Injectable()
export class AttachmentsService {
  private azureConnection =
    'DefaultEndpointsProtocol=https;AccountName=scrapreadydev;AccountKey=+kSAsUNhx1u07sZwzD7FIigcSc8RnEedh66cGe46Ex3Dccm+vt2/0WDHWD3Ih9B8UmjHf9pja/WMkPxj3o4q7w==;EndpointSuffix=core.windows.net';
  private containerName = 'attachments';

  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async uploadMultiple(files: Array<Express.Multer.File>) {
    const promises: Promise<any>[] = [];
    const urls: string[] = [];

    files.forEach(async (file) => {
      promises.push(this.uploadSingle(file).then((url) => urls.push(url)));
    });

    await Promise.all(promises);
    return urls;
  }

  async uploadSingle(file: Express.Multer.File) {
    if (!file.mimetype.includes('image/')) {
      console.log('not Image');
      throw new BadRequestException('Not a valid image');
    }
    try {
      const blobClient = this.getBlobClient(file.originalname);
      const upload = await blobClient.uploadData(file.buffer);
      return upload._response.request.url;
    } catch (e) {
      throw InternalServerErrorException;
    }
  }
}
