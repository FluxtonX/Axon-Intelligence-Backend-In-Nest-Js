import { PrismaService } from '../database/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ProposalsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(freelancerId: string, dto: CreateProposalDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ProposalStatus;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
        projectId: string;
        freelancerId: string;
    }>;
    findMyProposals(freelancerId: string): Promise<({
        project: {
            title: string;
            client: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ProposalStatus;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
        projectId: string;
        freelancerId: string;
    })[]>;
    findByProject(projectId: string, clientId: string): Promise<({
        freelancer: {
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
        status: import("@prisma/client").$Enums.ProposalStatus;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
        projectId: string;
        freelancerId: string;
    })[]>;
    acceptProposal(id: string, clientId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        submissionUrl: string | null;
        submissionNotes: string | null;
        proposalId: string | null;
    }>;
}
