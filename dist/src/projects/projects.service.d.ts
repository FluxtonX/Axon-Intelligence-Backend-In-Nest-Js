import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(clientId: string, dto: CreateProjectDto): Promise<{
        id: string;
        title: string;
        description: string;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        skills: string[];
        createdAt: Date;
        clientId: string;
    }>;
    findAll(q?: string, skip?: number, take?: number, minBudget?: number, maxBudget?: number): Promise<{
        projects: ({
            client: {
                id: string;
                profile: {
                    id: string;
                    title: string | null;
                    skills: string[];
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    bio: string | null;
                    hourlyRate: number | null;
                    averageRating: number | null;
                    totalReviews: number;
                } | null;
            };
        } & {
            id: string;
            title: string;
            description: string;
            budget: number;
            timeline: string | null;
            status: import("@prisma/client").$Enums.ProjectStatus;
            skills: string[];
            createdAt: Date;
            clientId: string;
        })[];
        total: number;
    }>;
    findAllByClient(clientId: string, page?: number, limit?: number): Promise<{
        data: ({
            client: {
                id: string;
                profile: {
                    id: string;
                    title: string | null;
                    skills: string[];
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    bio: string | null;
                    hourlyRate: number | null;
                    averageRating: number | null;
                    totalReviews: number;
                } | null;
            };
            proposals: {
                id: string;
                status: import("@prisma/client").$Enums.ProposalStatus;
                createdAt: Date;
                projectId: string;
                freelancerId: string;
                bidAmount: number;
                deliveryDays: number;
                coverLetter: string;
            }[];
        } & {
            id: string;
            title: string;
            description: string;
            budget: number;
            timeline: string | null;
            status: import("@prisma/client").$Enums.ProjectStatus;
            skills: string[];
            createdAt: Date;
            clientId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        client: {
            id: string;
            profile: {
                id: string;
                title: string | null;
                skills: string[];
                userId: string;
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
                bio: string | null;
                hourlyRate: number | null;
                averageRating: number | null;
                totalReviews: number;
            } | null;
        };
        proposals: {
            id: string;
            status: import("@prisma/client").$Enums.ProposalStatus;
            createdAt: Date;
            projectId: string;
            freelancerId: string;
            bidAmount: number;
            deliveryDays: number;
            coverLetter: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        skills: string[];
        createdAt: Date;
        clientId: string;
    }>;
    update(id: string, clientId: string, dto: UpdateProjectDto): Promise<{
        id: string;
        title: string;
        description: string;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        skills: string[];
        createdAt: Date;
        clientId: string;
    }>;
}
