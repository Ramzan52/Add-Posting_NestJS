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
      recieverId: dto.senderId,
      recieverName: dto.senderName,
      senderId: dto.recieverId,
      senderName: dto.recieverName,
      timeStamp: dto.timeStamp,
      text: dto.text,
    };
    let conversation = {
      senderId: dto.senderId,
      senderName: dto.senderName,
      recieverId: dto.recieverId,
      recieverName: dto.recieverName,

      message: {
        senderId: dto.senderId,
        senderName: dto.senderName,
        recieverId: dto.recieverId,
        recieverName: dto.recieverName,
        timeStamp: dto.timeStamp,
        text: dto.text,
      },
    };
    this.ConversationSvc.postConversation(conversation);
    const existingMessage = await this.messageModel.findOneAndReplace(
      { senderId: dto.senderId, recieverId: dto.recieverId },
      dto,
      { new: true },
    );
    if (existingMessage) {
      const existingMessageFlip = await this.messageModel.findOneAndReplace(
        { recieverId: dto.senderId, senderId: dto.recieverId },
        data,
        { new: true },
      );
      this.fcmSvc.findDeviceToken(dto.recieverId, dto);
      return existingMessage;
    } else {
      const message = await new this.messageModel(dto);
      const messageFlip = await new this.messageModel(data);
      messageFlip.save();
      this.fcmSvc.findDeviceToken(dto.recieverId, dto);
      return message.save();
    }
  }
  async getMessage(id: String, pageSize: number, pageNumber: number) {
    console.log(id);
    var query = this.messageModel.find({ senderId: id });
    var count = await query.countDocuments();
    if (count === 0) {
      throw new NotFoundException('no message found');
    }
    var response = await this.messageModel
      .find({ senderId: id })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    return {
      count: count,
      result: response,
    };
  }
}
