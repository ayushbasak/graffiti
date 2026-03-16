import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, unique: true })
    txnid: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    gcAmount: number;

    @Prop({ default: 'pending', enum: ['pending', 'success', 'failure'] })
    status: string;

    @Prop({ type: Object })
    payuData: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
