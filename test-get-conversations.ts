import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const userId = 'cc5eb511-1a6c-4f53-9752-0078997f873a'; // Afnan's ID based on the DB logs

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
    
    // THIS IS THE BUG!
    // What if otherUser or otherUser.id is undefined/null?
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
