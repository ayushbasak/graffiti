import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, PaymentSchema } from './payment.schema';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
        UsersModule,
        ConfigModule,
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule { }
