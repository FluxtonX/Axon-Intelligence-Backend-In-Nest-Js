import type { RawBodyRequest } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import type { Request } from 'express';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
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
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
