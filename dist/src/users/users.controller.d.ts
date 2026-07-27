import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
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
    updateProfile(user: any, updateData: any): Promise<{
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
    searchFreelancers(q?: string, skip?: string, take?: string, maxHourlyRate?: string): Promise<{
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
