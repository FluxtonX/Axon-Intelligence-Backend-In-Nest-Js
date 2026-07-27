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
}
