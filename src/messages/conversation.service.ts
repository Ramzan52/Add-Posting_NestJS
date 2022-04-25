import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostConversation } from './dto/create.conversation.dto';
import { ApiOkResponse } from '@nestjs/swagger';
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
    let receiver = await this.userModel.findById(dto.receiverId);
    let sender = await this.userModel.findById(id);
    let Data = {
      senderId: id,
      receiverId: dto.receiverId,
      senderName: sender.name,
      receiverName: receiver.name,
      timeStamp: new Date(),
      message: dto.message,
    };
    let flipData = {
      receiverId: id,
      senderId: dto.receiverId,
      senderName: receiver.name,
      receiverName: sender.name,
      timeStamp: new Date(),
      message: dto.message,
    };

    const conversation = new this.conversationModel(Data);
    const conversationFlip = new this.conversationModel(flipData);
    conversationFlip.save();
    return conversation.save();
  }

  @ApiOkResponse({ status: 200, type: PostConversation })
  async getConversation(receiverId: string, sender: string) {
    return await this.conversationModel
      .find({ $and: [{ senderId: sender }, { receiverId: receiverId }] })
      .sort([['timeStamp', -1]])
      .exec();
  }
}
