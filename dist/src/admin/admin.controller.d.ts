import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getUsers(skip: number, take: number): Promise<{
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
    suspendUser(id: string, isSuspended: boolean): Promise<{
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
    resolveDispute(id: string, refundClientPercentage: number): Promise<{
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
