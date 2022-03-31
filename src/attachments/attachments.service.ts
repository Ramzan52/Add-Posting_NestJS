import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AttachmentsService {
  private azureConnection =
    'DefaultEndpointsProtocol=https;AccountName=a360scrapreadydev;AccountKey=AVLRr/lH1QZ9wB6C2ZHBhjb4hWusts3242knrTAs31FUBpGAJZC8Elq3Wo7SGOkVmvbgF2i879LQ+ASttmtupA==;EndpointSuffix=core.windows.net';
  private containerName = 'secure-attachments';

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
      throw new InternalServerErrorException();
    }
  }
}
