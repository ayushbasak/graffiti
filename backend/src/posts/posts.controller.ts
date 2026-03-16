import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Get()
    async getPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ) {
        const posts = await this.postsService.findAll(Number(page), Number(limit));
        const total = await this.postsService.countAll();
        return {
            posts,
            total,
            page: Number(page),
            last_page: Math.ceil(total / limit),
        };
    }
}
