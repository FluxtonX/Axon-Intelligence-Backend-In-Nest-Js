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
        email: string;
        googleId: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        isSuspended: boolean;
        createdAt: Date;
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
