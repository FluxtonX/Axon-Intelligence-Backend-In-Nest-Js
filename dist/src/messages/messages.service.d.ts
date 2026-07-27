import { PrismaService } from '../database/prisma.service';
import { MessagesGateway } from './messages.gateway';
export declare class MessagesService {
    private prisma;
    private messagesGateway;
    constructor(prisma: PrismaService, messagesGateway: MessagesGateway);
    sendMessage(senderId: string, receiverId: string, content: string): Promise<{
        id: string;
        content: string;
        read: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
    }>;
    getConversation(userId1: string, userId2: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            content: string;
            read: boolean;
            createdAt: Date;
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
        content: string;
        read: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
    }>;
    getConversations(userId: string): Promise<any[]>;
}
