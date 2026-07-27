import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst({ where: { email: 'afnan@example.com' } });
  if (!user) {
    console.log('User not found');
    return;
  }
  
  try {
    // Generate token by calling login endpoint or we can just mock it
    // Wait, it's easier to just call the messagesService directly!
    const { MessagesService } = require('./src/messages/messages.service');
    const service = new MessagesService(prisma, null);
    const conversations = await service.getConversations(user.id);
    console.log('CONVERSATIONS FETCHED SUCCESSFULLY:');
    console.dir(conversations, { depth: null });
  } catch (e) {
    console.error('ERROR GETTING CONVERSATIONS:', e);
  } finally {
    prisma.$disconnect();
  }
}
run();
