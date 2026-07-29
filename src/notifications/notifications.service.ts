import { Injectable, Logger, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { PrismaService } from '../database/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import * as path from 'path';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private firebaseApp: App;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway
  ) {}

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

  // Unified method to send both In-App and Push notification
  async sendNotification(
    userId: string,
    title: string,
    body: string,
    type: any = 'SYSTEM',
    data?: any
  ) {
    try {
      // 1. Save to Database
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          title,
          body,
          type,
          data: data || {},
        },
      });

      // 2. Emit via WebSocket for instant in-app delivery
      this.notificationsGateway.sendNotificationToUser(userId, notification);

      // 3. (Optional fallback) Send FCM Push Notification for offline delivery
      this.sendPushNotification(userId, title, body, data).catch(err => 
        this.logger.error(`Failed to send push fallback: ${err.message}`)
      );

      return notification;
    } catch (error) {
      this.logger.error(`Failed to send notification to user ${userId}`, error);
      throw error;
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
        return false;
      }

      // Convert data to strings for FCM
      const stringData: { [key: string]: string } = {};
      if (data) {
        Object.keys(data).forEach(key => {
          stringData[key] = String(data[key]);
        });
      }

      const message: Message = {
        token: user.fcmToken,
        notification: {
          title,
          body,
        },
        data: stringData,
      };

      await getMessaging(this.firebaseApp).send(message);
      return true;
    } catch (error) {
      this.logger.error(`Error sending push notification to user ${userId}`, error);
      return false;
    }
  }

  // REST API Methods
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

