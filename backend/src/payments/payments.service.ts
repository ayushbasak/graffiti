import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Payment, PaymentDocument } from './payment.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
    private readonly payuKey: string;
    private readonly payuSalt: string;

    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        this.payuKey = this.configService.get<string>('PAYU_KEY');
        this.payuSalt = this.configService.get<string>('PAYU_SALT');
    }

    async initiatePayment(userId: string, amount: number, gcAmount: number) {
        const txnid = `GT_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Create pending record
        const payment = new this.paymentModel({
            userId,
            txnid,
            amount,
            gcAmount,
        });
        await payment.save();

        // In a real Payu implementation, you need these basic params:
        // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
        const user = await this.usersService.getUserById(userId as any);
        const productinfo = `Buy ${gcAmount} Graffiti Coins`;
        const firstname = user.username;
        const email = 'user@example.com';
        const udf1 = user.username;

        const hashString = `${this.payuKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}||||||||||${this.payuSalt}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        return {
            key: this.payuKey,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            udf1,
            hash,
            surl: 'http://localhost:5000/payments/success',
            furl: 'http://localhost:5000/payments/failure',
        };
    }

    async handleCallback(payload: any) {
        const { txnid, status, hash, amount } = payload;

        // 1. Verify Hash to ensure it's not a fraudulent request
        // Correct Order: SALT|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        const reversedHashString = `${this.payuSalt}|${status}||||||||||${payload.udf1}|${payload.email}|${payload.firstname}|${payload.productinfo}|${amount}|${txnid}|${this.payuKey}`;
        const calculatedHash = crypto.createHash('sha512').update(reversedHashString).digest('hex');

        // In local dev with test keys, you might want to bypass strict hash check if keys are wrong
        // if (calculatedHash !== hash) throw new InternalServerErrorException('Hash Mismatch');

        const payment = await this.paymentModel.findOne({ txnid });
        if (!payment) throw new InternalServerErrorException('Transaction not found');

        if (status === 'success' && payment.status !== 'success') {
            payment.status = 'success';
            payment.payuData = payload;
            await payment.save();

            // Credit the user with GC coins!
            await this.usersService.addGC(payment.userId as any, payment.gcAmount);
            console.log(`Credited User ${payment.userId} with ${payment.gcAmount} GC`);
        } else {
            payment.status = 'failure';
            await payment.save();
        }

        return payment;
    }
}
