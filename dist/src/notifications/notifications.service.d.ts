import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService implements OnModuleInit {
    private readonly prisma;
    private readonly notificationsGateway;
    private readonly logger;
    private firebaseApp;
    constructor(prisma: PrismaService, notificationsGateway: NotificationsGateway);
    onModuleInit(): void;
    sendNotification(userId: string, title: string, body: string, type?: any, data?: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        type: import("@prisma/client").$Enums.NotificationType;
        body: string;
        isRead: boolean;
    }>;
    sendPushNotification(userId: string, title: string, body: string, data?: {
        [key: string]: string;
    }): Promise<boolean>;
    getUserNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        type: import("@prisma/client").$Enums.NotificationType;
        body: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
