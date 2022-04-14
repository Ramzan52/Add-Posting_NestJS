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
import { Post, PostDocument } from 'src/posts/schemas/post.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly ConversationSvc: ConversationService,
    private readonly fcmSvc: FcmTOkenService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}
  async postMessage(dto: PostFirstMessage, id: string) {
    let reciever = await this.userModel.findById(dto.recieverId);
    let sender = await this.userModel.findById(id);
    let post = await this.postModel.findById(dto.postId);
    if (!reciever) {
      throw new NotFoundException('Reciever not found');
    }
    if (!sender) {
      throw new NotFoundException('sender not found');
    }
    if (!post) {
      throw new NotFoundException('post not found');
    }
    let data = {
      senderId: id,
      senderName: sender.name,
      recieverId: dto.recieverId,
      recieverName: reciever.name,
      timeStamp: new Date(),
      post: post,
      text: dto.latestText,
    };

    let flipData = {
      recieverId: id,
      recieverName: sender.name,
      senderId: dto.recieverId,
      senderName: reciever.name,
      timeStamp: new Date(),
      post: post,
      text: dto.latestText,
    };

    const existingMessage = await this.messageModel.findOneAndReplace(
      { senderId: id, recieverId: dto.recieverId },
      data,
      { new: true },
    );
    if (existingMessage) {
      const existingMessageFlip = await this.messageModel.findOneAndReplace(
        { recieverId: id, senderId: dto.recieverId },
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
  async sendMessage(dto: SendMessage, userID: string) {
    const sender = await this.userModel.findById(userID);
    const receiver = await this.userModel.findById(dto.recieverId);

    let data = {
      senderId: userID,
      recieverId: dto.recieverId,
      senderName: sender.name,
      recieverName: receiver.name,
      message: {
        text: dto.text,
        type: dto.type,
        senderId: userID,
        recieverId: dto.recieverId,
      },
      timeStamp: new Date(),
    };
    try {
      let message = await this.ConversationSvc.postConversation(data, userID);
      this.fcmSvc.findDeviceToken(dto.recieverId, data);
      const existingMessage = await this.messageModel.findOne({
        senderId: userID,
        recieverId: dto.recieverId,
      });
      if (existingMessage) {
        existingMessage.text = dto.text;
        existingMessage.save();
        const existingMessageFlip = await this.messageModel.findOne({
          recieverId: userID,
          senderId: dto.recieverId,
        });
        existingMessageFlip.text = dto.text;
        existingMessageFlip.save();
        return existingMessage;
      }

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

  async markAsRead(senderId: string, receiverId: string) {

    var existingMessage = await this.messageModel.aggregate([
      {
        $match : {
          $and: [
            {
            senderId: senderId,
            recieverId: receiverId
            }
          ]
        }
      }
    ]).exec();

    console.log("existing message", existingMessage);
  }
}
