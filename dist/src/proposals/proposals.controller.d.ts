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
    findByProject(projectId: string, user: any): Promise<({
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
    acceptProposal(id: string, user: any): Promise<{
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
