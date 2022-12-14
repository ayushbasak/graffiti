import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ImageQueueModule } from './imagequeue/imagequeue.module';
import { DisplayModule } from './display/display.module';
import { InvitationModule } from './invitation/invitation.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/graffiti'),
    UsersModule,
    AuthModule,
    ImageQueueModule,
    DisplayModule,
    InvitationModule,
  ],
})
export class AppModule {}
