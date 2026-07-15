import { PrismaService } from '../database/prisma.service';
export declare class ContractsService {
    private prisma;
    private stripe;
    constructor(prisma: PrismaService);
    createCheckout(proposalId: string, clientId: string): Promise<{
        url: string | null;
    }>;
    handleStripeWebhook(signature: string, payload: Buffer): Promise<void>;
}
