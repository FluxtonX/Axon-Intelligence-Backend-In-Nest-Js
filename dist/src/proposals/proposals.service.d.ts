import { PrismaService } from '../database/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
export declare class ProposalsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findByProject(projectId: string, clientId: string): Promise<({
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
    acceptProposal(id: string, clientId: string): Promise<{
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
