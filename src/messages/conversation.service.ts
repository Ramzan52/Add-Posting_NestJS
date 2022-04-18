import { PostFirstMessage } from './dto/post.message.dto';
import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { PostMessage } from './dto/create.message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Req } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostConversation } from './dto/create.conversation.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { send } from 'process';
import { identity } from 'rxjs';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Profile, ProfileDocument } from 'src/profile/schemas/profile.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}
  async postConversation(dto: Conversation, id: string) {
    let reciever = await this.userModel.findById(dto.recieverId);
    let sender = await this.userModel.findById(id);
    let Data = {
      senderId: id,
      recieverId: dto.recieverId,
      senderName: sender.name,
      recieverName: reciever.name,
      timeStamp: new Date(),
      message: dto.message,
    };
    let flipData = {
      recieverId: id,
      senderId: dto.recieverId,
      senderName: reciever.name,
      recieverName: sender.name,
      timeStamp: new Date(),
      message: dto.message,
    };

    const conversation = new this.conversationModel(Data);
    const conversationFlip = new this.conversationModel(flipData);
    conversationFlip.save();
    return conversation.save();
  }

  @ApiOkResponse({ status: 200, type: PostConversation })
  async getConversation(recieverId: string, sender: string) {
    return await this.conversationModel
      .find({ $and: [{ senderId: sender }, { recieverId: recieverId }] })
      .sort([['timeStamp', -1]])
      .exec();
  }
}
