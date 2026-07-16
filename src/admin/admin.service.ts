import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletsService: WalletsService,
  ) {}

  async getUsers(skip: number = 0, take: number = 20) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total };
  }

  async suspendUser(userId: string, isSuspended: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended },
    });
  }

  async getMetrics() {
    const [totalUsers, activeContracts, totalEscrow, totalTransactions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.contract.count({ where: { status: 'ACTIVE' } }),
      this.prisma.wallet.aggregate({ _sum: { escrow: true } }),
      this.prisma.transaction.count(),
    ]);

    return {
      totalUsers,
      activeContracts,
      totalEscrow: totalEscrow._sum.escrow || 0,
      totalTransactions,
    };
  }

  async resolveDispute(contractId: string, refundClientPercentage: number) {
    if (refundClientPercentage < 0 || refundClientPercentage > 100) {
      throw new BadRequestException('Percentage must be between 0 and 100');
    }

    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract || contract.status !== 'DISPUTED') {
      throw new BadRequestException('Contract not found or not disputed');
    }

    const clientRefundAmount = contract.amount * (refundClientPercentage / 100);
    const freelancerAmount = contract.amount - clientRefundAmount;

    return this.prisma.$transaction(async (tx) => {
      // Release escrow back to client and freelancer based on the split
      if (clientRefundAmount > 0) {
        // Technically we are refunding back into client's balance
        const clientWallet = await tx.wallet.findUnique({ where: { userId: contract.clientId } });
        if (clientWallet) {
          await tx.wallet.update({
            where: { id: clientWallet.id },
            data: {
              escrow: { decrement: contract.amount }, // decrease entire escrow from client
              balance: { increment: clientRefundAmount }, // refund part to balance
            },
          });
          await tx.transaction.create({
            data: {
              walletId: clientWallet.id,
              amount: clientRefundAmount,
              type: 'ESCROW_RELEASE',
              status: 'COMPLETED',
              referenceId: contractId,
            },
          });
        }
      } else {
        // if 0% to client, just decrease escrow
        const clientWallet = await tx.wallet.findUnique({ where: { userId: contract.clientId } });
        if (clientWallet) {
          await tx.wallet.update({
            where: { id: clientWallet.id },
            data: { escrow: { decrement: contract.amount } },
          });
        }
      }

      if (freelancerAmount > 0) {
        const freelancerWallet = await tx.wallet.findUnique({ where: { userId: contract.freelancerId } });
        if (freelancerWallet) {
          await tx.wallet.update({
            where: { id: freelancerWallet.id },
            data: { balance: { increment: freelancerAmount } },
          });
          await tx.transaction.create({
            data: {
              walletId: freelancerWallet.id,
              amount: freelancerAmount,
              type: 'EARNING',
              status: 'COMPLETED',
              referenceId: contractId,
            },
          });
        }
      }

      // Mark contract as resolved (using COMPLETED for simplicity or could add RESOLVED)
      return tx.contract.update({
        where: { id: contractId },
        data: { status: 'COMPLETED' },
      });
    });
  }
}
