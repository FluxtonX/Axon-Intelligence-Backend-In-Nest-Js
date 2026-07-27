"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const messages_gateway_1 = require("./messages.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
let MessagesService = class MessagesService {
    prisma;
    messagesGateway;
    notificationsService;
    constructor(prisma, messagesGateway, notificationsService) {
        this.prisma = prisma;
        this.messagesGateway = messagesGateway;
        this.notificationsService = notificationsService;
    }
    async sendMessage(senderId, receiverId, content) {
        const message = await this.prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });
        this.messagesGateway.server.emit(`messageToUser-${receiverId}`, message);
        this.notificationsService.sendPushNotification(receiverId, 'New Message', content, { type: 'chat', senderId }).catch(err => console.error('Failed to send push notification', err));
        return message;
    }
    async getConversation(userId1, userId2, page = 1, limit = 20) {
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
    async getUnreadCount(userId) {
        return this.prisma.message.count({
            where: {
                receiverId: userId,
                read: false,
            },
        });
    }
    async markAsRead(messageId, userId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message || message.receiverId !== userId) {
            throw new common_1.NotFoundException('Message not found or unauthorized');
        }
        return this.prisma.message.update({
            where: { id: messageId },
            data: { read: true },
        });
    }
    async getConversations(userId) {
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => messages_gateway_1.MessagesGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        messages_gateway_1.MessagesGateway,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map