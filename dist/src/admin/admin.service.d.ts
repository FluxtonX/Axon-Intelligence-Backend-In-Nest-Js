import { PrismaService } from '../database/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
export declare class AdminService {
    private readonly prisma;
    private readonly walletsService;
    constructor(prisma: PrismaService, walletsService: WalletsService);
    getUsers(skip?: number, take?: number): Promise<{
        users: ({
            profile: {
                title: string | null;
                firstName: string;
                lastName: string;
                id: string;
                avatarUrl: string | null;
                bio: string | null;
                hourlyRate: number | null;
                skills: string[];
                averageRating: number | null;
                totalReviews: number;
                userId: string;
            } | null;
        } & {
            email: string;
            id: string;
            googleId: string | null;
            passwordHash: string | null;
            authProvider: string;
            role: import("@prisma/client").$Enums.Role;
            isSuspended: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    suspendUser(userId: string, isSuspended: boolean): Promise<{
        email: string;
        id: string;
        googleId: string | null;
        passwordHash: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        isSuspended: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMetrics(): Promise<{
        totalUsers: number;
        activeContracts: number;
        totalEscrow: number;
        totalTransactions: number;
    }>;
    resolveDispute(contractId: string, refundClientPercentage: number): Promise<{
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
}
