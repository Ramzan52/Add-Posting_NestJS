import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FavoritePosts } from './schemas/favorite-posts.schema';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class FavoritePostsService {
    constructor(
        @InjectModel(FavoritePosts.name) private readonly favoritePostModel: Model<FavoritePosts>,
    ) {}

    async likePost(id: string, like: boolean) {
    
        
    }

}