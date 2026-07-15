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
        clientId: string;
        projectId: string;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ContractStatus;
        freelancerId: string;
        amount: number;
        proposalId: string | null;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
