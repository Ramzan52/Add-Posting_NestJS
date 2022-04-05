import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { PostMessage } from './dto/create.message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostConversation } from './dto/create.conversation.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { send } from 'process';
import { identity } from 'rxjs';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}
  async postConversation(dto: PostConversation) {
    let data = {
      reciever: dto.sender,
      sender: dto.reciever,
      message: dto.message,
    };

    const conversation = new this.conversationModel(dto);
    const conversationFlip = new this.conversationModel(data);
    conversationFlip.save();
    return conversation.save();
  }
  @ApiOkResponse({ status: 200, type: PostConversation })
  getConversation(id: string, sender: string) {
    let conversationList = this.conversationModel.find({
      sender: sender,
      reciever: id,
    });
    return conversationList;
  }
}
