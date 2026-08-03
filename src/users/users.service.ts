import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async updateDeviceToken(userId: string, token: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        bio: data.bio,
        skills: data.skills,
        title: data.title,
        avatarUrl: data.avatarUrl,
        firstName: data.firstName,
        lastName: data.lastName,
        hourlyRate: data.hourlyRate,
      },
    });
  }

  async searchFreelancers(q?: string, skip: number = 0, take: number = 20, maxHourlyRate?: number) {
    const whereClause: any = {};
    
    if (q) {
      whereClause.OR = [
        { profile: { title: { contains: q, mode: 'insensitive' } } },
        { profile: { bio: { contains: q, mode: 'insensitive' } } },
        { profile: { skills: { has: q } } },
      ];
    }

    if (maxHourlyRate) {
      whereClause.profile = {
        ...whereClause.profile,
        hourlyRate: { lte: maxHourlyRate },
      };
    }

    // Only return users who actually have a profile set up (and maybe specifically ones who act as freelancers, but for now any profile works)
    whereClause.profile = { ...whereClause.profile, isNot: null };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take,
        include: { profile: true },
        orderBy: { profile: { averageRating: 'desc' } },
      }),
      this.prisma.user.count({ where: whereClause }),
    ]);

    // Sanitize output
    const sanitizedUsers = users.map(user => {
      const { passwordHash, ...result } = user;
      return result;
    });

    return { data: sanitizedUsers, total, skip, take };
  }

  async getClientDashboard(userId: string) {
    // 1. Fetch Submitted Contracts (Waiting for Review)
    const submittedContracts = await this.prisma.contract.findMany({
      where: {
        clientId: userId,
        status: 'SUBMITTED',
      },
      include: {
        project: {
          include: { client: { select: { id: true, profile: true } } },
        },
        proposal: {
          include: { freelancer: { select: { id: true, profile: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // 2. Fetch Recent Activity (Notifications)
    const recentActivity = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // 3. Fetch Recommended Talent (Freelancers)
    const recommendedTalentData = await this.searchFreelancers(undefined, 0, 5);
    const recommendedTalent = recommendedTalentData.data;

    // 4. Calculate Stats
    const statsData = await this.prisma.contract.groupBy({
      by: ['status'],
      where: { clientId: userId },
      _sum: { amount: true },
      _count: { _all: true },
    });

    let totalSpend = 0;
    let activeContracts = 0;
    let totalHires = 0;

    for (const stat of statsData) {
      totalHires += stat._count._all;
      
      if (stat.status === 'ACTIVE' || stat.status === 'SUBMITTED') {
        activeContracts += stat._count._all;
      }
      
      if (['ACTIVE', 'SUBMITTED', 'COMPLETED'].includes(stat.status)) {
        totalSpend += stat._sum.amount || 0;
      }
    }

    return {
      stats: {
        totalSpend,
        activeContracts,
        totalHires,
      },
      submittedContracts,
      recentActivity,
      recommendedTalent,
    };
  }
}
