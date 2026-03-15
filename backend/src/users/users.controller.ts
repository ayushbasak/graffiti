import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':username')
    async getProfile(@Param('username') username: string) {
        const user: any = await this.usersService.getUser(username);
        if (!user || !user.username) {
            throw new NotFoundException('User not found');
        }

        // Return public info
        return {
            username: user.username,
            gc: user.gc,
            createdAt: user.createdAt,
            access_level: user.access_level,
        };
    }
}
