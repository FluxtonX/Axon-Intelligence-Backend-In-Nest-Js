import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
export declare class ProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    create(user: any, createProposalDto: CreateProposalDto): Promise<{
        id: string;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
        status: import("@prisma/client").$Enums.ProposalStatus;
        createdAt: Date;
        projectId: string;
        freelancerId: string;
    }>;
    findMyProposals(user: any): Promise<({
        project: {
            title: string;
            client: {
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
        };
    } & {
        id: string;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
        status: import("@prisma/client").$Enums.ProposalStatus;
        createdAt: Date;
        projectId: string;
        freelancerId: string;
    })[]>;
    findByProject(projectId: string, user: any): Promise<({
        freelancer: {
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
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
        status: import("@prisma/client").$Enums.ProposalStatus;
        createdAt: Date;
        projectId: string;
        freelancerId: string;
    })[]>;
    acceptProposal(id: string, user: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        projectId: string;
        freelancerId: string;
        clientId: string;
        amount: number;
        proposalId: string | null;
    }>;
}
