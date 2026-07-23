import { PrismaService } from '../database/prisma.service';
export declare class WalletsService {
    private prisma;
    constructor(prisma: PrismaService);
    getWallet(userId: string): Promise<{
        transactions: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.TransactionStatus;
            amount: number;
            type: import("@prisma/client").$Enums.TransactionType;
            walletId: string;
            referenceId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
    deposit(userId: string, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
    withdraw(userId: string, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
    lockEscrow(clientId: string, amount: number, contractId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
    releaseEscrowToEarnings(freelancerId: string, clientId: string, amount: number, contractId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
}
