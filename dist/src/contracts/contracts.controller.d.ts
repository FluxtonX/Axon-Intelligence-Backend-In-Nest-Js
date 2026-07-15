import type { RawBodyRequest } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import type { Request } from 'express';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    createCheckout(proposalId: string, user: any): Promise<{
        url: string | null;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
}
