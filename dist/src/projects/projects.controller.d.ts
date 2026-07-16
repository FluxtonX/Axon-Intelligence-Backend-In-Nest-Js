import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(user: any, createProjectDto: CreateProjectDto): Promise<{
        description: string;
        title: string;
        clientId: string;
        id: string;
        createdAt: Date;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
    }>;
    findAll(page?: string, limit?: string): Promise<{
        data: ({
            client: {
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
                id: string;
            };
        } & {
            description: string;
            title: string;
            clientId: string;
            id: string;
            createdAt: Date;
            budget: number;
            timeline: string | null;
            status: import("@prisma/client").$Enums.ProjectStatus;
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
            projectId: string;
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProposalStatus;
            deliveryDays: number;
            freelancerId: string;
            bidAmount: number;
            coverLetter: string;
        }[];
        client: {
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
            id: string;
        };
    } & {
        description: string;
        title: string;
        clientId: string;
        id: string;
        createdAt: Date;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
    }>;
    update(id: string, user: any, updateProjectDto: UpdateProjectDto): Promise<{
        description: string;
        title: string;
        clientId: string;
        id: string;
        createdAt: Date;
        budget: number;
        timeline: string | null;
        status: import("@prisma/client").$Enums.ProjectStatus;
    }>;
}
