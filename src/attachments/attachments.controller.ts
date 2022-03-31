import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/auth-guards';
import { AttachmentsService } from './attachments.service';
@ApiTags('Attachments')
@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentSvc: AttachmentsService) {}

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadMultiple(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Array<string>> {
    return await this.attachmentSvc.uploadMultiple(files);
  }

  @Post('/single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.attachmentSvc.uploadSingle(file);
  }
}
