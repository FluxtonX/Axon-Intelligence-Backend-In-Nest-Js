import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
export declare class ProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    create(user: any, createProposalDto: CreateProposalDto): Promise<{
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ProposalStatus;
        freelancerId: string;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
    }>;
    findMyProposals(user: any): Promise<({
        project: {
            title: string;
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
            };
        };
    } & {
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ProposalStatus;
        freelancerId: string;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
    })[]>;
    findByProject(projectId: string, user: any): Promise<({
        freelancer: {
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
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ProposalStatus;
        freelancerId: string;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
    })[]>;
    acceptProposal(id: string, user: any): Promise<{
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
}
