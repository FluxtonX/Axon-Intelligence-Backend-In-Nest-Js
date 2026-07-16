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
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    }>;
    fundContract(contractId: string, clientId: string): Promise<{
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    }>;
    getMyContracts(userId: string): Promise<({
        project: {
            id: string;
            clientId: string;
            status: import("@prisma/client").$Enums.ProjectStatus;
            createdAt: Date;
            title: string;
            description: string;
            budget: number;
            timeline: string | null;
            skills: string[];
        };
        proposal: ({
            freelancer: {
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
                id: string;
            };
        } & {
            id: string;
            projectId: string;
            freelancerId: string;
            status: import("@prisma/client").$Enums.ProposalStatus;
            createdAt: Date;
            bidAmount: number;
            deliveryDays: number;
            coverLetter: string;
        }) | null;
    } & {
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    })[]>;
    submitWork(contractId: string, freelancerId: string, submissionDetails: string): Promise<{
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    }>;
    handleStripeWebhook(signature: string, payload: Buffer): Promise<void>;
}
