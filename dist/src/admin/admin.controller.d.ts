import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getUsers(skip: number, take: number): Promise<{
        users: ({
            profile: {
                id: string;
                title: string | null;
                skills: string[];
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                bio: string | null;
                hourlyRate: number | null;
                averageRating: number | null;
                totalReviews: number;
                userId: string;
            } | null;
        } & {
            id: string;
            email: string;
            passwordHash: string | null;
            googleId: string | null;
            authProvider: string;
            role: import("@prisma/client").$Enums.Role;
            isSuspended: boolean;
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
    resolveDispute(id: string, refundClientPercentage: number): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
}
