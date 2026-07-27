"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function run() {
    const user = await prisma.user.findFirst({ where: { email: 'afnan@example.com' } });
    if (!user) {
        console.log('User not found');
        return;
    }
    try {
        const { MessagesService } = require('./src/messages/messages.service');
        const service = new MessagesService(prisma, null);
        const conversations = await service.getConversations(user.id);
        console.log('CONVERSATIONS FETCHED SUCCESSFULLY:');
        console.dir(conversations, { depth: null });
    }
    catch (e) {
        console.error('ERROR GETTING CONVERSATIONS:', e);
    }
    finally {
        prisma.$disconnect();
    }
}
run();
//# sourceMappingURL=check-api.js.map