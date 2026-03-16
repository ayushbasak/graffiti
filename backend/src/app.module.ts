import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ImageQueueModule } from './imagequeue/imagequeue.module';
import { DisplayModule } from './display/display.module';
import { InvitationModule } from './invitation/invitation.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    ImageQueueModule,
    DisplayModule,
    InvitationModule,
    PaymentsModule,
  ],
})
export class AppModule { }
