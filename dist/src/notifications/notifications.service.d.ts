import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
export declare class NotificationsService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    private firebaseApp;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    sendPushNotification(userId: string, title: string, body: string, data?: {
        [key: string]: string;
    }): Promise<boolean>;
}
