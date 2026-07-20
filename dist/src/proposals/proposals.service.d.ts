import { PrismaService } from '../database/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
export declare class ProposalsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(freelancerId: string, dto: CreateProposalDto): Promise<{
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ProposalStatus;
        freelancerId: string;
        bidAmount: number;
        deliveryDays: number;
        coverLetter: string;
    }>;
    findByProject(projectId: string, clientId: string): Promise<({
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
    acceptProposal(id: string, clientId: string): Promise<{
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
