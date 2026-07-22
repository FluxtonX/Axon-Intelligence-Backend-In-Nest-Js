import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No DATABASE_URL found in .env");
    process.exit(1);
  }

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Get all users
  const users = await prisma.user.findMany();
  
  if (users.length === 0) {
    console.log("No users found. Please sign in first.");
    return;
  }
  
  for (const user of users) {
    // Create a Project
    const project = await prisma.project.create({
      data: {
        clientId: user.id,
        title: "Design an E-commerce App for " + user.email,
        description: "I need a full Figma design for an e-commerce platform.",
        budget: 500.0,
        status: "PUBLISHED",
      }
    });

    // Create a Proposal
    const proposal = await prisma.proposal.create({
      data: {
        projectId: project.id,
        freelancerId: user.id, // User is both client and freelancer for testing
        bidAmount: 500.0,
        deliveryDays: 5,
        coverLetter: "I can do this design perfectly.",
        status: "ACCEPTED",
      }
    });

    // Create a Contract
    const contract = await prisma.contract.create({
      data: {
        proposalId: proposal.id,
        projectId: project.id,
        clientId: user.id,
        freelancerId: user.id,
        amount: 500.0,
        status: "PENDING_PAYMENT",
      }
    });
    console.log(`✅ Seeded Contract for user ${user.email} (ID: ${user.id})`);
  }

  console.log("✅ Done seeding for all users.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
