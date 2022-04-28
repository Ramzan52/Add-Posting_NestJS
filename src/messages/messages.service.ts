import { ConversationService } from './conversation.service';
import { Message, MessageDocument } from './schema/post.message.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, mongo } from 'mongoose';
import { FcmTOkenService } from './fcmNotification.service';
import { SendMessage } from './dto/sendMessage.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { PostFirstMessage } from './dto/post.message.dto';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import { profile } from 'console';
import { Profile, ProfileDocument } from 'src/profile/schemas/profile.schema';
import { AzureSASServiceService } from 'src/azure-sasservice/azure-sasservice.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly ConversationSvc: ConversationService,
    private readonly fcmSvc: FcmTOkenService,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private sasSvc: AzureSASServiceService,
  ) {}

  async postMessage(dto: PostFirstMessage, id: string) {
    let receiver = await this.profileModel.findOne({ userId: dto.receiverId });
    let sender = await this.profileModel.findOne({ userId: id });
    let post = await this.postModel.findOne({ id: dto.postId });
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
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
      senderImage: sender.profilePic,
      receiverImage: receiver.profilePic,
      receiverId: dto.receiverId,
      receiverName: receiver.name,
      timeStamp: new Date(),
      post: post,
      text: dto.latestText,
    };

    let flipData = {
      receiverId: id,
      receiverName: sender.name,
      senderImage: receiver.profilePic,
      receiverImage: sender.profilePic,
      senderId: dto.receiverId,
      senderName: receiver.name,
      timeStamp: new Date(),
      post: post,
      text: dto.latestText,
    };

    const existingMessage = await this.messageModel.findOne({
      senderId: id,
      receiverId: dto.receiverId,
    });

    if (existingMessage) {
      return existingMessage;
    }

    const message = await new this.messageModel(data);
    const messageFlip = await new this.messageModel(flipData);
    messageFlip.save();
    return message.save();
  }
  async sendMessage(dto: SendMessage, userID: string) {
    const sender = await this.profileModel.findOne({ userId: userID });
    const receiver = await this.profileModel.findOne({
      userId: dto.receiverId,
    });

    let data = {
      senderId: userID,
      receiverId: dto.receiverId,
      senderName: sender.name,
      receiverName: receiver.name,
      senderImage: sender.profilePic,
      receiverImage: receiver.profilePic,
      senderRating: sender.avgRating,
      receiverRating: receiver.avgRating,
      postId: dto.postId,

      message: {
        text: dto.text,
        type: dto.type,
        senderId: userID,
        receiverId: dto.receiverId,
      },
      timeStamp: new Date(),
    };
    try {
      let message = await this.ConversationSvc.postConversation(data, userID);
      await this.fcmSvc.findDeviceToken(dto.receiverId, data);

      const existingMessage = await this.messageModel.findOne({
        senderId: userID,
        receiverId: dto.receiverId,
      });

      if (existingMessage) {
        existingMessage.text = dto.text;
        existingMessage.isRead = false;
        await existingMessage.save();
        const existingMessageFlip = await this.messageModel.findOne({
          receiverId: userID,
          senderId: dto.receiverId,
        });

        existingMessageFlip.text = dto.text;
        existingMessageFlip.isRead = false;
        await existingMessageFlip.save();
        return existingMessage;
      }

      return message;
    } catch {
      throw new BadRequestException();
    }
  }
  async getMessage(
    id: String,
    pageSize: number,
    pageNumber: number,
    unread: boolean,
  ) {
    const query = this.messageModel.find({ senderId: id });
    const count = await query.countDocuments();

    if (unread) {
      const response = await this.messageModel
        .find({ $and: [{ senderId: id }, { isRead: false }] })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([['timeStamp', -1]])
        .exec();
      return {
        count: count,
        result: response,
        sas: this.sasSvc.getNewSASKey(),
      };
    } else {
      const response = await this.messageModel
        .find({ senderId: id })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([['timeStamp', -1]])
        .exec();
      return {
        count: count,
        result: response,
        sas: this.sasSvc.getNewSASKey(),
      };
    }
  }

  async markAsRead(senderId: string, receiverId: string) {
    const existingMessage = await this.messageModel.findOne({
      senderId: senderId,
      receiverId: receiverId,
    });

    if (existingMessage) {
      existingMessage.isRead = true;
      await this.messageModel
        .replaceOne(
          { _id: new mongo.ObjectId(existingMessage.id) },
          existingMessage,
        )
        .exec();

      return existingMessage;
    }

    throw new NotFoundException('No conversation exists against this receiver');
  }
}
