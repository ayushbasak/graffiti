import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

    async create(data: any): Promise<Post> {
        const newPost = new this.postModel(data);
        return await newPost.save();
    }

    async findAll(page: number = 1, limit: number = 20): Promise<Post[]> {
        return await this.postModel
            .find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async countAll(): Promise<number> {
        return await this.postModel.countDocuments();
    }
}
