import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    author: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    author_name: string;

    @Prop({ required: true })
    url: string;

    @Prop({ default: '' })
    content: string;

    @Prop({ default: 0 })
    bumps: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
