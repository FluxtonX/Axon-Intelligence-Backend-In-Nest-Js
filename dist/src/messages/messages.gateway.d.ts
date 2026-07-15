import { Server, Socket } from 'socket.io';
import { PrismaService } from '../database/prisma.service';
export declare class MessagesGateway {
    private prisma;
    server: Server;
    constructor(prisma: PrismaService);
    handleMessage(data: {
        senderId: string;
        receiverId: string;
        content: string;
    }, client: Socket): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        read: boolean;
        senderId: string;
        receiverId: string;
    }>;
}
