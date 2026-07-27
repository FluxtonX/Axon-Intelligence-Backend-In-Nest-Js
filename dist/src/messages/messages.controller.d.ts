import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getConversations(req: any): Promise<any[]>;
    sendMessage(req: any, receiverId: string, content: string): Promise<{
        id: string;
        senderId: string;
        receiverId: string;
        content: string;
        read: boolean;
        createdAt: Date;
    }>;
    getConversation(req: any, otherUserId: string, page: number, limit: number): Promise<{
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
    getUnreadCount(req: any): Promise<number>;
    markAsRead(req: any, id: string): Promise<{
        id: string;
        senderId: string;
        receiverId: string;
        content: string;
        read: boolean;
        createdAt: Date;
    }>;
}
