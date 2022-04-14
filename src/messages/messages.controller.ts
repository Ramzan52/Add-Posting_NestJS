import { PostFirstMessage } from './dto/post.message.dto';
import { SendMessage } from './dto/sendMessage.dto';
import { ConversationService } from './conversation.service';
import { MessagesService } from './messages.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostMessage } from './dto/create.message.dto';
import { UsersService } from 'src/users/users.service';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';
import { ProfileService } from 'src/profile/profile.service';

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
  async sendMessage(@Request() req: any ,@Body() body: SendMessage) {
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
    @Query('pageSize') pageSize?: number,
    @Query('pageNumber') pageNumber?: number,
  ) {
    if (pageSize == null || pageSize < 1) pageSize = 10;
    if (pageNumber == null || pageNumber < 1) pageNumber = 1;

    return await this.messageSvc.getMessage(req.user.id, pageSize, pageNumber, true);
  }

  @Get()
  @ApiOkResponse({ status: 200, type: PostMessage })
  async getMessage(
    @Request() req: any,
    @Query('pageSize') pageSize?: number,
    @Query('pageNumber') pageNumber?: number,
  ) {
    if (pageSize == null || pageSize < 1) pageSize = 10;
    if (pageNumber == null || pageNumber < 1) pageNumber = 1;

    return await this.messageSvc.getMessage(req.user.id, pageSize, pageNumber, false);
  }

  @Get('/conversation')
  async getConversation( @Request() req: any, @Query('recieverId') recieverId: string) {
    let conversation = await this.conversationSvc.getConversation(recieverId, req.user.id);
    let existingMessage = await this.messageSvc.markAsRead(req.user.id, recieverId);
    let receiverUser = await this.profileSvc.findByUserId(recieverId);
    return {
      list: conversation,
      post: existingMessage[0].post,
      receiverUser: receiverUser,
      sas: this.sasSvc.getNewSASKey(),
    };
  }
}
