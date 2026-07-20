import { PrismaService } from '../database/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
export declare class ContractsService {
    private prisma;
    private walletsService;
    private stripe;
    constructor(prisma: PrismaService, walletsService: WalletsService);
    createCheckout(proposalId: string, clientId: string): Promise<{
        url: string | null;
    }>;
    completeContract(contractId: string, clientId: string): Promise<{
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    fundContract(contractId: string, clientId: string): Promise<{
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    getMyContracts(userId: string): Promise<({
        project: {
            description: string;
            title: string;
            clientId: string;
            id: string;
            createdAt: Date;
            skills: string[];
            budget: number;
            timeline: string | null;
            status: import("@prisma/client").$Enums.ProjectStatus;
        };
        proposal: ({
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
        }) | null;
    } & {
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    })[]>;
    submitWork(contractId: string, freelancerId: string, submissionDetails: string): Promise<{
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    disputeContract(contractId: string, userId: string): Promise<{
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    handleStripeWebhook(signature: string, payload: Buffer): Promise<void>;
}
