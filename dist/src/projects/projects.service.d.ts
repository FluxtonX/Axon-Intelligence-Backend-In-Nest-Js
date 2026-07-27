import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(clientId: string, dto: CreateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        skills: string[];
        description: string;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        clientId: string;
    }>;
    findAll(q?: string, skip?: number, take?: number, minBudget?: number, maxBudget?: number, freelancerId?: string): Promise<{
        projects: ({
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
        })[];
        total: number;
    }>;
    findAllByClient(clientId: string, page?: number, limit?: number): Promise<{
        data: ({
            proposals: {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProposalStatus;
                bidAmount: number;
                deliveryDays: number;
                coverLetter: string;
                projectId: string;
                freelancerId: string;
            }[];
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        proposals: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProposalStatus;
            bidAmount: number;
            deliveryDays: number;
            coverLetter: string;
            projectId: string;
            freelancerId: string;
        }[];
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
    }>;
    update(id: string, clientId: string, dto: UpdateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        skills: string[];
        description: string;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
        clientId: string;
    }>;
    handleAiChat(step: number, message: string): Promise<{
        text: string;
        options: string[] | undefined;
        status: string;
        generatedBrief: any;
    }>;
}
