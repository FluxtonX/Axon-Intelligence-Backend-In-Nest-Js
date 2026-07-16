import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getUsers(skip: number, take: number): Promise<{
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
            email: string;
            passwordHash: string | null;
            googleId: string | null;
            authProvider: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
    }>;
    suspendUser(id: string, isSuspended: boolean): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        googleId: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMetrics(): Promise<{
        totalUsers: number;
        activeContracts: number;
        totalEscrow: number;
        totalTransactions: number;
    }>;
    resolveDispute(id: string, refundClientPercentage: number): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
    }>;
}
