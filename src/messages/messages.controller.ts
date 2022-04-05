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
  postMessage(@Body() body: PostMessage) {
    this.messageSvc.postMessage(body);
  }
  @Get()
  @ApiOkResponse({ status: 200, type: PostMessage })
  getMessage(@Request() req: any) {
    this.messageSvc.getMessage(req.user.id);
  }
  @Get('/conversation')
  getConversation(@Param('recieverId') id: string, @Request() req: any) {
    this.conversationSvc.getConversation(id, req.user.id);
  }
}
