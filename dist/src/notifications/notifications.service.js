"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const prisma_service_1 = require("../database/prisma.service");
const notifications_gateway_1 = require("./notifications.gateway");
const path = __importStar(require("path"));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    notificationsGateway;
    logger = new common_1.Logger(NotificationsService_1.name);
    firebaseApp;
    constructor(prisma, notificationsGateway) {
        this.prisma = prisma;
        this.notificationsGateway = notificationsGateway;
    }
    onModuleInit() {
        try {
            const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');
            this.firebaseApp = (0, app_1.initializeApp)({
                credential: (0, app_1.cert)(serviceAccountPath),
            });
            this.logger.log('Firebase Admin initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Firebase Admin', error);
        }
    }
    async sendNotification(userId, title, body, type = 'SYSTEM', data) {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    userId,
                    title,
                    body,
                    type,
                    data: data || {},
                },
            });
            this.notificationsGateway.sendNotificationToUser(userId, notification);
            this.sendPushNotification(userId, title, body, data).catch(err => this.logger.error(`Failed to send push fallback: ${err.message}`));
            return notification;
        }
        catch (error) {
            this.logger.error(`Failed to send notification to user ${userId}`, error);
            throw error;
        }
    }
    async sendPushNotification(userId, title, body, data) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { fcmToken: true },
            });
            if (!user || !user.fcmToken) {
                return false;
            }
            const stringData = {};
            if (data) {
                Object.keys(data).forEach(key => {
                    stringData[key] = String(data[key]);
                });
            }
            const message = {
                token: user.fcmToken,
                notification: {
                    title,
                    body,
                },
                data: stringData,
            };
            await (0, messaging_1.getMessaging)(this.firebaseApp).send(message);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending push notification to user ${userId}`, error);
            return false;
        }
    }
    async getUserNotifications(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: { userId, isRead: false },
        });
    }
    async markAsRead(notificationId, userId) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_gateway_1.NotificationsGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map