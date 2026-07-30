import { PrismaService } from '../database/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateDirectContractDto } from './dto/create-direct-contract.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ContractsService {
    private prisma;
    private walletsService;
    private notificationsService;
    private stripe;
    constructor(prisma: PrismaService, walletsService: WalletsService, notificationsService: NotificationsService);
    createDirectContract(clientId: string, dto: CreateDirectContractDto): Promise<{
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
    createCheckout(contractId: string, clientId: string): Promise<{
        url: string | null;
    }>;
    createPaymentIntent(contractId: string, clientId: string): Promise<{
        clientSecret: string | null;
    }>;
    completeContract(contractId: string, clientId: string): Promise<{
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
    fundContract(contractId: string, clientId: string): Promise<{
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
    getMyContracts(userId: string): Promise<({
        project: {
            client: {
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
            title: string;
            skills: string[];
            description: string;
            budget: number;
            timeline: string | null;
            status: import("@prisma/client").$Enums.ProjectStatus;
            clientId: string;
        };
        proposal: ({
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
        }) | null;
        reviews: {
            id: string;
            createdAt: Date;
            contractId: string;
            revieweeId: string;
            rating: number;
            comment: string | null;
            reviewerId: string;
        }[];
    } & {
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
    })[]>;
    getContractById(contractId: string, userId: string): Promise<{
        project: {
            client: {
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
            title: string;
            skills: string[];
            description: string;
            budget: number;
            timeline: string | null;
            status: import("@prisma/client").$Enums.ProjectStatus;
            clientId: string;
        };
        proposal: ({
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
        }) | null;
        reviews: {
            id: string;
            createdAt: Date;
            contractId: string;
            revieweeId: string;
            rating: number;
            comment: string | null;
            reviewerId: string;
        }[];
    } & {
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
    submitWork(contractId: string, freelancerId: string, submissionDetails: string, submissionUrl?: string): Promise<{
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
    disputeContract(contractId: string, userId: string): Promise<{
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
    handleStripeWebhook(signature: string, payload: Buffer): Promise<void>;
}
