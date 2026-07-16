import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(to: string, resetCode: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Password Reset Code - Axon Intelligence',
        text: `Your password reset code is: ${resetCode}\nThis code will expire in 15 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>You have requested to reset your password. Use the following code to proceed:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px;">
              ${resetCode}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
        `,
      });
      console.log(`Password reset email sent successfully to ${to}`);
    } catch (error) {
      console.error(`Failed to send password reset email to ${to}:`, error);
      // We don't throw the error here so we don't break the standard API response,
      // but we log it for debugging.
    }
  }
}
