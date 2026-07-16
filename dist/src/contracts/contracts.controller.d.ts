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
            projectId: string;
            freelancerId: string;
            status: import("@prisma/client").$Enums.ProposalStatus;
            createdAt: Date;
            bidAmount: number;
            deliveryDays: number;
            coverLetter: string;
        }) | null;
        project: {
            id: string;
            clientId: string;
            status: import("@prisma/client").$Enums.ProjectStatus;
            createdAt: Date;
            title: string;
            skills: string[];
            description: string;
            budget: number;
            timeline: string | null;
        };
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
    createCheckout(proposalId: string, user: any): Promise<{
        url: string | null;
    }>;
    completeContract(id: string, user: any): Promise<{
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    }>;
    fundContract(id: string, user: any): Promise<{
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    }>;
    submitWork(id: string, submissionDetails: string, user: any): Promise<{
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    }>;
    disputeContract(id: string, user: any): Promise<{
        id: string;
        proposalId: string | null;
        projectId: string;
        clientId: string;
        freelancerId: string;
        amount: number;
        status: import("@prisma/client").$Enums.ContractStatus;
        createdAt: Date;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
