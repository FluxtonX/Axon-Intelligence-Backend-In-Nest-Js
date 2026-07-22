import { PrismaService } from '../database/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
export declare class ContractsService {
    private prisma;
    private walletsService;
    private stripe;
    constructor(prisma: PrismaService, walletsService: WalletsService);
    createDirectContract(clientId: string, dto: import('./dto/create-direct-contract.dto').CreateDirectContractDto): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    createCheckout(proposalId: string, clientId: string): Promise<{
        url: string | null;
    }>;
    completeContract(contractId: string, clientId: string): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    fundContract(contractId: string, clientId: string): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    getMyContracts(userId: string): Promise<({
        proposal: ({
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
            freelancerId: string;
            status: import("@prisma/client").$Enums.ProposalStatus;
            createdAt: Date;
            projectId: string;
            bidAmount: number;
            deliveryDays: number;
            coverLetter: string;
        }) | null;
        project: {
            client: {
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
            clientId: string;
            status: import("@prisma/client").$Enums.ProjectStatus;
            createdAt: Date;
            title: string;
            description: string;
            budget: number;
            timeline: string | null;
            skills: string[];
        };
    } & {
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    })[]>;
    submitWork(contractId: string, freelancerId: string, submissionDetails: string): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    disputeContract(contractId: string, userId: string): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    handleStripeWebhook(signature: string, payload: Buffer): Promise<void>;
}
