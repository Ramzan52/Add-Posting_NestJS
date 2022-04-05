import { PostConversation } from './dto/create.conversation.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Conversation } from './schema/conversation.schema';
import { ConversationService } from './conversation.service';
import { PostMessage } from './dto/create.message.dto';
import { Message, MessageDocument } from './schema/post.message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { FcmTOkenService } from './fcmNotification.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly ConversationSvc: ConversationService,
    private readonly fcmSvc: FcmTOkenService,
  ) {}
  async postMessage(dto: PostMessage) {
    let data = {
      reciever: dto.sender,
      sender: dto.reciever,
      timeStamp: dto.timeStamp,
      text: dto.text,
    };
    let conversation = {
      reciever: dto.sender,
      sender: dto.reciever,
      message: {
        reciever: dto.sender,
        sender: dto.reciever,
        timeStamp: dto.timeStamp,
        text: dto.text,
      },
    };
    this.ConversationSvc.postConversation(conversation);
    const existingMessage = await this.messageModel.findOneAndReplace(
      { sender: dto.sender, reciever: dto.reciever },
      dto,
      { new: true },
    );
    if (existingMessage) {
      const existingMessageFlip = await this.messageModel.findOneAndReplace(
        { reciever: dto.sender, sender: dto.reciever },
        data,
        { new: true },
      );
      this.fcmSvc.findDeviceToken(dto.reciever, dto);
      return existingMessage;
    } else {
      const message = await new this.messageModel(dto);
      const messageFlip = await new this.messageModel(data);
      messageFlip.save();
      this.fcmSvc.findDeviceToken(dto.reciever, dto);
      return message.save();
    }
  }
  async getMessage(id: String) {
    let message = this.messageModel.find({ sender: id });
    if (!message) {
      throw new NotFoundException('no message found');
    }
    return message;
  }
}
