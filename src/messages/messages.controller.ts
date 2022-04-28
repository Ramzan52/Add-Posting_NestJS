import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { ProfileService } from 'src/profile/profile.service';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { PostMessage } from './dto/create.message.dto';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';
import { PostFirstMessage } from './dto/post.message.dto';
import { SendMessage } from './dto/sendMessage.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageSvc: MessagesService,
    private readonly conversationSvc: ConversationService,
    private sasSvc: AzureSASServiceService,
    private readonly profileSvc: ProfileService,
  ) {}
  @Post('create-chat')
  async postMessage(@Body() body: PostFirstMessage, @Request() req: any) {
    let message = await this.messageSvc.postMessage(body, req.user.id);
    if (message) {
      return message;
    } else {
      throw new BadRequestException();
    }
  }
  @Post('send-message')
  async sendMessage(@Request() req: any, @Body() body: SendMessage) {
    let message = await this.messageSvc.sendMessage(body, req.user.id);
    if (message) {
      return message;
    } else {
      throw new BadRequestException();
    }
  }

  @Get('unread')
  @ApiOkResponse({ status: 200, type: PostMessage })
  async getUnreadMessage(
    @Request() req: any,
    @Query() query: GetMessagesQueryDto,
  ) {
    const { pageNumber, pageSize } = query;

    return await this.messageSvc.getMessage(
      req.user.id,
      pageSize,
      pageNumber,
      true,
    );
  }

  @Get()
  @ApiOkResponse({ status: 200, type: PostMessage })
  async getMessage(@Request() req: any, @Query() query: GetMessagesQueryDto) {
    const { pageNumber, pageSize } = query;

    return await this.messageSvc.getMessage(
      req.user.id,
      pageSize,
      pageNumber,
      false,
    );
  }

  @Get('/conversation')
  async getConversation(
    @Request() req: any,
    @Query('receiverId') receiverId: string,
    @Query('postId') postId: string,
  ) {
    const conversation = await this.conversationSvc.getConversation(
      receiverId,
      req.user.id,
      postId,
    );

    const existingMessage = await this.messageSvc.markAsRead(
      req.user.id,
      receiverId,
    );

    const receiverUser = await this.profileSvc.findByUserId(receiverId);

    return {
      list: conversation,
      post: existingMessage.post,
      receiverUser: receiverUser,
      sas: this.sasSvc.getNewSASKey(),
    };
  }
}
