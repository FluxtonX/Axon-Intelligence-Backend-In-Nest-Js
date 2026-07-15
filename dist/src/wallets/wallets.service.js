"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let WalletsService = class WalletsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWallet(userId) {
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
    async deposit(userId, amount) {
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
    async withdraw(userId, amount) {
        const wallet = await this.getWallet(userId);
        if (wallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
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
    async lockEscrow(clientId, amount, contractId) {
        const wallet = await this.getWallet(clientId);
        if (wallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient balance to fund contract escrow');
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
    async releaseEscrowToEarnings(freelancerId, clientId, amount, contractId) {
        const clientWallet = await this.getWallet(clientId);
        const freelancerWallet = await this.getWallet(freelancerId);
        if (clientWallet.escrow < amount) {
            throw new common_1.BadRequestException('Insufficient escrow balance');
        }
        const platformFeePercentage = 0.10;
        const feeAmount = amount * platformFeePercentage;
        const freelancerEarning = amount - feeAmount;
        return this.prisma.$transaction(async (tx) => {
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
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map