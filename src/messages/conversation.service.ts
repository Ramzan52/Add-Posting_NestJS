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
    let receiver = await this.profileModel.findOne({ userId: dto.receiverId });
    let sender = await this.profileModel.findOne({ userId: id });
    let Data = {
      senderId: id,
      receiverId: dto.receiverId,
      senderName: sender.name,
      senderImage: sender.profilePic,
      senderRating: sender.avgRating,
      receiverRating: sender.avgRating,
      receiverImage: receiver.profilePic,
      receiverName: receiver.name,
      timeStamp: new Date(),
      message: dto.message,
      postId: dto.postId,
    };
    let flipData = {
      receiverId: id,
      senderId: dto.receiverId,
      senderName: receiver.name,
      receiverName: sender.name,
      receiverImage: sender.profilePic,
      senderImage: receiver.profilePic,

      timeStamp: new Date(),
      message: dto.message,
      postId: dto.postId,
    };

    const conversation = new this.conversationModel(Data);
    const conversationFlip = new this.conversationModel(flipData);
    conversationFlip.save();
    return conversation.save();
  }

  @ApiOkResponse({ status: 200, type: PostConversation })
  async getConversation(receiverId: string, sender: string, postId: string) {
    return await this.conversationModel
      .find({
        $and: [
          { senderId: sender },
          { receiverId: receiverId },
          { postId: postId },
        ],
      })
      .sort([['timeStamp', -1]])
      .exec();
  }
}
