import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/user.schema';
import { UsersModule } from 'src/users/users.module';
import { DisplayController } from './display.controller';
import { DisplaySchema } from './display.schema';
import { DisplayService } from './display.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'display',
        schema: DisplaySchema,
      },
      {
        name: 'users',
        schema: UserSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [DisplayController],
  providers: [DisplayService],
})
export class DisplayModule {}
