import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
export declare class ProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    create(user: any, createProposalDto: CreateProposalDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ProposalStatus;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
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
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    bio: string | null;
                    hourlyRate: number | null;
                    averageRating: number | null;
                    totalReviews: number;
                    userId: string;
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
    findByProject(projectId: string, user: any): Promise<({
        freelancer: {
            id: string;
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
    acceptProposal(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
}
