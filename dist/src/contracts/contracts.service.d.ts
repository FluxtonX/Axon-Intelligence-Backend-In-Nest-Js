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
    handleStripeWebhook(signature: string, payload: Buffer): Promise<void>;
}
