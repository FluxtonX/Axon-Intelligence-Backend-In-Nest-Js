import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(user: any, createProjectDto: CreateProjectDto): Promise<{
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
    handleAiChat(step: number, message: string): Promise<{
        text: string;
        options: string[] | undefined;
        status: string;
        generatedBrief: any;
    }>;
    findAll(user: any, q?: string, skip?: number, take?: number, minBudget?: string, maxBudget?: string): Promise<{
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
    findMyProjects(user: any, page?: string, limit?: string): Promise<{
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
    update(id: string, user: any, updateProjectDto: UpdateProjectDto): Promise<{
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
