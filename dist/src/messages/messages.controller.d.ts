import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getConversations(req: any): Promise<any[]>;
    sendMessage(req: any, receiverId: string, content: string): Promise<{
        id: string;
        content: string;
        read: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
    }>;
    getConversation(req: any, otherUserId: string, page: number, limit: number): Promise<{
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
    getUnreadCount(req: any): Promise<number>;
    markAsRead(req: any, id: string): Promise<{
        id: string;
        content: string;
        read: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
    }>;
}
