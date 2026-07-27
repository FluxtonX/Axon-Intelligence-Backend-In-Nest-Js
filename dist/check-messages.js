"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const messages = await prisma.message.findMany({
        include: {
            sender: { select: { id: true, email: true } },
            receiver: { select: { id: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    console.log('ALL MESSAGES:', JSON.stringify(messages, null, 2));
    const users = await prisma.user.findMany({
        include: { profile: true }
    });
    console.log('\nALL USERS:');
    for (const u of users) {
        console.log(`${u.id} - ${u.email} - ${u.profile?.firstName} ${u.profile?.lastName} (Title: ${u.profile?.title})`);
    }
}
main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-messages.js.map