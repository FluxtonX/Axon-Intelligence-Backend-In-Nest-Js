import { PrismaService } from '../database/prisma.service';
import { MessagesGateway } from './messages.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class MessagesService {
    private prisma;
    private messagesGateway;
    private notificationsService;
    constructor(prisma: PrismaService, messagesGateway: MessagesGateway, notificationsService: NotificationsService);
    sendMessage(senderId: string, receiverId: string, content: string): Promise<{
        id: string;
        senderId: string;
        receiverId: string;
        content: string;
        read: boolean;
        createdAt: Date;
    }>;
    getConversation(userId1: string, userId2: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            senderId: string;
            receiverId: string;
            content: string;
            read: boolean;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(messageId: string, userId: string): Promise<{
        id: string;
        senderId: string;
        receiverId: string;
        content: string;
        read: boolean;
        createdAt: Date;
    }>;
    getConversations(userId: string): Promise<any[]>;
}
