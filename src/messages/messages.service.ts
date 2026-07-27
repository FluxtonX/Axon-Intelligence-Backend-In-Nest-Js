import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MessagesGateway } from './messages.gateway';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => MessagesGateway)) private messagesGateway: MessagesGateway,
    private notificationsService: NotificationsService,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    
    // Broadcast the message to the receiver in real-time
    this.messagesGateway.server.emit(`messageToUser-${receiverId}`, message);

    // Send push notification asynchronously
    this.notificationsService.sendPushNotification(
      receiverId,
      'New Message',
      content,
      { type: 'chat', senderId }
    ).catch(err => console.error('Failed to send push notification', err));
    
    return message;
  }

  async getConversation(userId1: string, userId2: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.message.count({
        where: {
          OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
          ],
        },
      }),
    ]);

    return {
      data: messages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.receiverId !== userId) {
      throw new NotFoundException('Message not found or unauthorized');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });
  }

  async getConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, profile: true } },
        receiver: { select: { id: true, profile: true } },
      },
    });

    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      
      if (msg.receiverId === userId && !msg.read) {
        conversationsMap.get(otherUser.id).unreadCount += 1;
      }
    }

    return Array.from(conversationsMap.values());
  }
}
