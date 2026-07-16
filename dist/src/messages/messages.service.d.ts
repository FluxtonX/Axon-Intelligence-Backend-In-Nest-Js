import { PrismaService } from '../database/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getConversation(userId1: string, userId2: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            content: string;
            read: boolean;
            senderId: string;
            receiverId: string;
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
        createdAt: Date;
        content: string;
        read: boolean;
        senderId: string;
        receiverId: string;
    }>;
}
