import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
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
    updateProfile(user: any, updateData: any): Promise<{
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
    updateDeviceToken(user: any, token: string): Promise<{
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
    searchFreelancers(q?: string, skip?: string, take?: string, maxHourlyRate?: string): Promise<{
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
