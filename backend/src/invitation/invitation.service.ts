import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation } from './invitation.interface';

@Injectable()
export class InvitationService {
  constructor(@InjectModel('Invitation') private invite: Model<Invitation>) {}

  genRandomCode(): string {
    const code = Math.random().toString(36).substring(2, 15);
    return code;
  }

  async addInvite(): Promise<Invitation> {
    const invite = new this.invite({ code: this.genRandomCode() });
    try {
      await invite.save();
      return invite;
    } catch (err) {
      return err;
    }
  }

  async getInvite(): Promise<Invitation> {
    try {
      const invite = await this.invite.findOne({ used: false });
      if (!invite) throw new Error('No invite found');
      invite.used = true;
      await invite.save();
      return invite;
    } catch (err) {
      return err;
    }
  }

  async checkInvite(code: string): Promise<boolean> {
    try {
      const invite = await this.invite.findOne({ code });
      if (!invite) return false;
      // if (invite.used) return false;
      // invite.used = true;
      // await invite.save();
      await this.invite.findOneAndDelete({ code });
      return true;
    } catch (err) {
      return false;
    }
  }
}
