import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Reviews System...');

  // 1. Create Client
  const client = await prisma.user.create({
    data: {
      email: `client_${Date.now()}@test.com`,
      profile: {
        create: {
          firstName: 'Client',
          lastName: 'User',
        },
      },
    },
  });
  console.log('Created Client:', client.id);

  // 2. Create Freelancer
  const freelancer = await prisma.user.create({
    data: {
      email: `freelancer_${Date.now()}@test.com`,
      profile: {
        create: {
          firstName: 'Freelancer',
          lastName: 'User',
        },
      },
    },
  });
  console.log('Created Freelancer:', freelancer.id);

  // 3. Create Project
  const project = await prisma.project.create({
    data: {
      clientId: client.id,
      title: 'Build a Mobile App',
      description: 'Need a flutter app.',
      budget: 1000,
    },
  });

  // 4. Create Contract (Active)
  const contract = await prisma.contract.create({
    data: {
      projectId: project.id,
      clientId: client.id,
      freelancerId: freelancer.id,
      amount: 1000,
      status: 'ACTIVE',
    },
  });
  console.log('Created Active Contract:', contract.id);

  // 5. Complete Contract
  const updatedContract = await prisma.contract.update({
    where: { id: contract.id },
    data: { status: 'COMPLETED' },
  });
  console.log('Contract Completed:', updatedContract.status);

  // 6. Client reviews Freelancer
  const review = await prisma.$transaction(async (tx) => {
    const r = await tx.review.create({
      data: {
        contractId: contract.id,
        reviewerId: client.id,
        revieweeId: freelancer.id,
        rating: 5,
        comment: 'Excellent work!',
      },
    });

    const aggregations = await tx.review.aggregate({
      where: { revieweeId: freelancer.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.profile.update({
      where: { userId: freelancer.id },
      data: {
        averageRating: aggregations._avg.rating || 0,
        totalReviews: aggregations._count.rating || 0,
      },
    });

    return r;
  });

  console.log('Review Created:', review.id);

  // 7. Verify Freelancer Profile
  const updatedFreelancerProfile = await prisma.profile.findUnique({
    where: { userId: freelancer.id },
  });

  console.log('Freelancer Profile after review:', {
    averageRating: updatedFreelancerProfile?.averageRating,
    totalReviews: updatedFreelancerProfile?.totalReviews,
  });

  // Cleanup
  await prisma.review.delete({ where: { id: review.id } });
  await prisma.contract.delete({ where: { id: contract.id } });
  await prisma.project.delete({ where: { id: project.id } });
  await prisma.profile.deleteMany({ where: { userId: { in: [client.id, freelancer.id] } } });
  await prisma.user.deleteMany({ where: { id: { in: [client.id, freelancer.id] } } });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
