import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get('stats')
    async getStats() {
        return await this.postsService.getGlobalStats();
    }

    @Get()
    async getPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('authorName') authorName?: string,
    ) {
        const posts = await this.postsService.findAll(Number(page), Number(limit), authorName);
        const total = await this.postsService.countAll(authorName);
        return {
            posts,
            total,
            page: Number(page),
            last_page: Math.ceil(total / limit),
        };
    }
}
