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
    handleStripeWebhook(signature: string, payload: Buffer): Promise<void>;
}
