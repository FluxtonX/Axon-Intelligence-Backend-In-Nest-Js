import { PrismaService } from '../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
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
        id: string;
        createdAt: Date;
        email: string;
        googleId: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        isSuspended: boolean;
        fcmToken: string | null;
        updatedAt: Date;
    }>;
    updateDeviceToken(userId: string, token: string): Promise<{
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
    updateProfile(userId: string, data: any): Promise<{
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
    }>;
    searchFreelancers(q?: string, skip?: number, take?: number, maxHourlyRate?: number): Promise<{
        data: {
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
            id: string;
            createdAt: Date;
            email: string;
            googleId: string | null;
            authProvider: string;
            role: import("@prisma/client").$Enums.Role;
            isSuspended: boolean;
            fcmToken: string | null;
            updatedAt: Date;
        }[];
        total: number;
        skip: number;
        take: number;
    }>;
    getClientDashboard(userId: string): Promise<{
        stats: {
            totalSpend: number;
            activeContracts: number;
            totalHires: number;
        };
        submittedContracts: ({
            project: {
                client: {
                    id: string;
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
                };
            } & {
                id: string;
                createdAt: Date;
                title: string;
                skills: string[];
                description: string;
                budget: number;
                timeline: string | null;
                status: import("@prisma/client").$Enums.ProjectStatus;
                clientId: string;
            };
            proposal: ({
                freelancer: {
                    id: string;
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
                };
            } & {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProposalStatus;
                bidAmount: number;
                deliveryDays: number;
                coverLetter: string;
                projectId: string;
                freelancerId: string;
            }) | null;
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ContractStatus;
            clientId: string;
            projectId: string;
            freelancerId: string;
            amount: number;
            submissionUrl: string | null;
            submissionNotes: string | null;
            deadline: Date | null;
            proposalId: string | null;
        })[];
        recentActivity: {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            data: import("@prisma/client/runtime/client").JsonValue | null;
            type: import("@prisma/client").$Enums.NotificationType;
            body: string;
            isRead: boolean;
        }[];
        recommendedTalent: {
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
            id: string;
            createdAt: Date;
            email: string;
            googleId: string | null;
            authProvider: string;
            role: import("@prisma/client").$Enums.Role;
            isSuspended: boolean;
            fcmToken: string | null;
            updatedAt: Date;
        }[];
    }>;
}
