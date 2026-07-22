import type { RawBodyRequest } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import type { Request } from 'express';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    getMyContracts(user: any): Promise<({
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
    createDirectContract(dto: import('./dto/create-direct-contract.dto').CreateDirectContractDto, user: any): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    createCheckout(proposalId: string, user: any): Promise<{
        url: string | null;
    }>;
    completeContract(id: string, user: any): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    fundContract(id: string, user: any): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    submitWork(id: string, submissionDetails: string, user: any): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    disputeContract(id: string, user: any): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
        proposalId: string | null;
        projectId: string;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
