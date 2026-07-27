"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function run() {
    const userId = 'cc5eb511-1a6c-4f53-9752-0078997f873a';
    const messages = await prisma.message.findMany({
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
        if (!otherUser || !otherUser.id) {
            console.log('MISSING OTHER USER for message:', msg.id);
            continue;
        }
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
    console.log(JSON.stringify(Array.from(conversationsMap.values()), null, 2));
}
run().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=test-get-conversations.js.map