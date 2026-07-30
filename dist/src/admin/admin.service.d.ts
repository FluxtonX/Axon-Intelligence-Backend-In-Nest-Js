import { PrismaService } from '../database/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
export declare class AdminService {
    private readonly prisma;
    private readonly walletsService;
    constructor(prisma: PrismaService, walletsService: WalletsService);
    getUsers(skip?: number, take?: number): Promise<{
        users: ({
            profile: {
                id: string;
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                bio: string | null;
                title: string | null;
                hourlyRate: number | null;
                skills: string[];
                averageRating: number | null;
                totalReviews: number;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            email: string;
            passwordHash: string | null;
            googleId: string | null;
            authProvider: string;
            role: import("@prisma/client").$Enums.Role;
            isSuspended: boolean;
            fcmToken: string | null;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    suspendUser(userId: string, isSuspended: boolean): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        isSuspended: boolean;
        fcmToken: string | null;
        updatedAt: Date;
    }>;
    getMetrics(): Promise<{
        totalUsers: number;
        activeContracts: number;
        totalEscrow: number;
        totalTransactions: number;
    }>;
    resolveDispute(contractId: string, refundClientPercentage: number): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        submissionUrl: string | null;
        submissionNotes: string | null;
        proposalId: string | null;
    }>;
}
