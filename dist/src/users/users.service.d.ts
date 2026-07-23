import { PrismaService } from '../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
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
        id: string;
        email: string;
        googleId: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        isSuspended: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, data: any): Promise<{
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
    }>;
    searchFreelancers(q?: string, skip?: number, take?: number, maxHourlyRate?: number): Promise<{
        data: {
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
            id: string;
            email: string;
            googleId: string | null;
            authProvider: string;
            role: import("@prisma/client").$Enums.Role;
            isSuspended: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        skip: number;
        take: number;
    }>;
}
