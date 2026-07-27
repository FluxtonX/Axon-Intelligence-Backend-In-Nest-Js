import type { RawBodyRequest } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import type { Request } from 'express';
import { CreateDirectContractDto } from './dto/create-direct-contract.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    getMyContracts(user: any): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    })[]>;
    createDirectContract(dto: CreateDirectContractDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    createCheckout(contractId: string, user: any): Promise<{
        url: string | null;
    }>;
    createPaymentIntent(contractId: string, user: any): Promise<{
        clientSecret: string | null;
    }>;
    completeContract(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    fundContract(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    submitWork(id: string, submissionDetails: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    disputeContract(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        clientId: string;
        projectId: string;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
