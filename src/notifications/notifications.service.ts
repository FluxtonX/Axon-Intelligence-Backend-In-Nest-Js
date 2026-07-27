import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { PrismaService } from '../database/prisma.service';
import * as path from 'path';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private firebaseApp: App;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    try {
      const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');
      this.firebaseApp = initializeApp({
        credential: cert(serviceAccountPath),
      });
      this.logger.log('Firebase Admin initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin', error);
    }
  }

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: { [key: string]: string }
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { fcmToken: true },
      });

      if (!user || !user.fcmToken) {
        this.logger.debug(`User ${userId} does not have an FCM token.`);
        return false;
      }

      const message: Message = {
        token: user.fcmToken,
        notification: {
          title,
          body,
        },
        data: data || {},
      };

      const response = await getMessaging(this.firebaseApp).send(message);
      this.logger.log(`Successfully sent message: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending push notification to user ${userId}`, error);
      return false;
    }
  }
}
