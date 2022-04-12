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
import { SendMessage } from './dto/sendMessage.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { PostFirstMessage } from './dto/post.message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly ConversationSvc: ConversationService,
    private readonly fcmSvc: FcmTOkenService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async postMessage(dto: PostFirstMessage, id: string) {
    let reciever = await this.userModel.findById(dto.recieverId);
    let sender = await this.userModel.findById(id);
    let data = {
      senderId: dto.senderId,
      senderName: sender.name,
      recieverId: dto.recieverId,
      recieverName: reciever.name,
      timeStamp: new Date(),
    };

    let flipData = {
      recieverId: dto.senderId,
      recieverName: sender.name,
      senderId: dto.recieverId,
      senderName: reciever.name,
      timeStamp: new Date(),
    };
    let conversation = {
      senderId: dto.senderId,
      senderName: sender.name,
      recieverId: dto.recieverId,
      recieverName: reciever.name,
      post: dto.post,

      message: {
        senderId: dto.senderId,
        senderName: sender.name,
        recieverId: dto.recieverId,
        recieverName: reciever.name,
        timeStamp: new Date(),

        post: dto.post,
      },
    };
    this.ConversationSvc.postConversation(conversation, id);
    const existingMessage = await this.messageModel.findOneAndReplace(
      { senderId: dto.senderId, recieverId: dto.recieverId },
      data,
      { new: true },
    );
    if (existingMessage) {
      const existingMessageFlip = await this.messageModel.findOneAndReplace(
        { recieverId: dto.senderId, senderId: dto.recieverId },
        flipData,
        { new: true },
      );
      return existingMessage;
    } else {
      const message = await new this.messageModel(data);
      const messageFlip = await new this.messageModel(flipData);
      messageFlip.save();
      return message.save();
    }
  }
  async sendMessage(dto: SendMessage) {
    let data = {
      dto,
      timeStamp: new Date(),
    };
    try {
      const message = new this.messageModel(data);
      this.fcmSvc.findDeviceToken(dto.recieverId, dto);

      return message;
    } catch {
      throw new NotFoundException();
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
      .limit(pageSize)
      .sort([['timeStamp', -1]])
      .exec();
    return {
      count: count,
      result: response,
    };
  }
}
