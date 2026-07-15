import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId },
        include: {
          transactions: true,
        },
      });
    }

    return wallet;
  }

  async deposit(userId: string, amount: number) {
    const wallet = await this.getWallet(userId);

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'DEPOSIT',
          status: 'COMPLETED',
        },
      });

      return updatedWallet;
    });
  }

  async withdraw(userId: string, amount: number) {
    const wallet = await this.getWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount,
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
        },
      });

      return updatedWallet;
    });
  }

  async lockEscrow(clientId: string, amount: number, contractId: string) {
    const wallet = await this.getWallet(clientId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance to fund contract escrow');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
          escrow: { increment: amount },
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount,
          type: 'ESCROW_LOCK',
          status: 'COMPLETED',
          referenceId: contractId,
        },
      });

      return updatedWallet;
    });
  }

  async releaseEscrowToEarnings(freelancerId: string, clientId: string, amount: number, contractId: string) {
    const clientWallet = await this.getWallet(clientId);
    const freelancerWallet = await this.getWallet(freelancerId);

    if (clientWallet.escrow < amount) {
      throw new BadRequestException('Insufficient escrow balance');
    }

    // Platform Fee Configuration (e.g. 10%)
    const platformFeePercentage = 0.10;
    const feeAmount = amount * platformFeePercentage;
    const freelancerEarning = amount - feeAmount;

    return this.prisma.$transaction(async (tx) => {
      // 1. Release Client Escrow
      await tx.wallet.update({
        where: { id: clientWallet.id },
        data: { escrow: { decrement: amount } },
      });

      await tx.transaction.create({
        data: {
          walletId: clientWallet.id,
          amount: -amount,
          type: 'ESCROW_RELEASE',
          status: 'COMPLETED',
          referenceId: contractId,
        },
      });

      // 2. Add Earnings to Freelancer
      const updatedFreelancerWallet = await tx.wallet.update({
        where: { id: freelancerWallet.id },
        data: { balance: { increment: freelancerEarning } },
      });

      await tx.transaction.create({
        data: {
          walletId: freelancerWallet.id,
          amount: freelancerEarning,
          type: 'EARNING',
          status: 'COMPLETED',
          referenceId: contractId,
        },
      });

      return updatedFreelancerWallet;
    });
  }
}
