import { Controller, Post, Body, UseGuards, Res, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AccessTokenGuard } from '../auth/gaurd';
import { GetUser } from '../auth/decorator';
import { ObjectId } from 'mongoose';

@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @UseGuards(AccessTokenGuard)
    @Post('initiate')
    async initiate(
        @GetUser('id') userId: string,
        @Body('amount') amount: number,
        @Body('gcAmount') gcAmount: number,
    ) {
        return await this.paymentsService.initiatePayment(userId, amount, gcAmount);
    }

    // PayU will POST to these URLs
    @Post('success')
    async success(@Body() body: any, @Res() res: any) {
        await this.paymentsService.handleCallback(body);
        // Redirect user back to frontend profile page
        return res.redirect(`http://localhost:3000/profile/${body.udf1}`);
    }

    @Post('failure')
    async failure(@Body() body: any, @Res() res: any) {
        await this.paymentsService.handleCallback(body);
        return res.redirect(`http://localhost:3000/profile/${body.udf1}?payment=failed`);
    }
}
