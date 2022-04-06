import { ConversationService } from './conversation.service';
import { MessagesService } from './messages.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/auth-guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostMessage } from './dto/create.message.dto';

@ApiTags('message')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageSvc: MessagesService,
    private readonly conversationSvc: ConversationService,
  ) {}
  @Post()
  async postMessage(@Body() body: PostMessage) {
    let message = await this.messageSvc.postMessage(body);
    return message;
  }
  @Get()
  @ApiOkResponse({ status: 200, type: PostMessage })
  async getMessage(@Request() req: any) {
    let messages = await this.messageSvc.getMessage(req.user.id);
    return messages;
  }
  @Get('/conversation')
  async getConversation(@Param('recieverId') id: string, @Request() req: any) {
    let conversation = this.conversationSvc.getConversation(id, req.user.id);
    return conversation;
  }
}
