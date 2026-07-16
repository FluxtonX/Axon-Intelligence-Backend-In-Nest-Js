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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const wallets_service_1 = require("../wallets/wallets.service");
let AdminService = class AdminService {
    prisma;
    walletsService;
    constructor(prisma, walletsService) {
        this.prisma = prisma;
        this.walletsService = walletsService;
    }
    async getUsers(skip = 0, take = 20) {
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
    async suspendUser(userId, isSuspended) {
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
    async resolveDispute(contractId, refundClientPercentage) {
        if (refundClientPercentage < 0 || refundClientPercentage > 100) {
            throw new common_1.BadRequestException('Percentage must be between 0 and 100');
        }
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract || contract.status !== 'DISPUTED') {
            throw new common_1.BadRequestException('Contract not found or not disputed');
        }
        const clientRefundAmount = contract.amount * (refundClientPercentage / 100);
        const freelancerAmount = contract.amount - clientRefundAmount;
        return this.prisma.$transaction(async (tx) => {
            if (clientRefundAmount > 0) {
                const clientWallet = await tx.wallet.findUnique({ where: { userId: contract.clientId } });
                if (clientWallet) {
                    await tx.wallet.update({
                        where: { id: clientWallet.id },
                        data: {
                            escrow: { decrement: contract.amount },
                            balance: { increment: clientRefundAmount },
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
            }
            else {
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
            return tx.contract.update({
                where: { id: contractId },
                data: { status: 'COMPLETED' },
            });
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallets_service_1.WalletsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map