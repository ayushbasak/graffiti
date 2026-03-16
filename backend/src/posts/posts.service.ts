import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';

import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel('imagequeue') private iq: Model<any>,
        private userService: UsersService,
    ) { }

    async getGlobalStats() {
        const totalPosts = await this.postModel.countDocuments();
        const totalUsers = await this.userService.countAll(); // I need to add this to UserService
        const queueSize = await this.iq.countDocuments();
        return { totalPosts, totalUsers, queueSize };
    }

    async create(data: any): Promise<Post> {
        const newPost = new this.postModel(data);
        return await newPost.save();
    }

    async findAll(page: number = 1, limit: number = 20, authorName?: string): Promise<Post[]> {
        const query = authorName ? { author_name: authorName } : {};
        return await this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async countAll(authorName?: string): Promise<number> {
        const query = authorName ? { author_name: authorName } : {};
        return await this.postModel.countDocuments(query);
    }
}
