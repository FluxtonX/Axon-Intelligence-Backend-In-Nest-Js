import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
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
        email: string;
        id: string;
        googleId: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        isSuspended: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(user: any, updateData: any): Promise<{
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
    }>;
    searchFreelancers(q?: string, skip?: string, take?: string, maxHourlyRate?: string): Promise<{
        data: {
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
            email: string;
            id: string;
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
