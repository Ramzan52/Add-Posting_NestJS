import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/models/base-document.schema';
import { Post } from './post.schema';

export type FavoritePostsDocument = FavoritePosts & Document;
@Schema()
export class FavoritePosts extends BaseSchema {

    @Prop({ required: true })
    userId: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    postId: Post;
}
export const FavoritePostsSchema = SchemaFactory.createForClass(FavoritePosts);