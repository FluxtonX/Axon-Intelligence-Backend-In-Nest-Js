import { WalletsService } from './wallets.service';
import { DepositDto, WithdrawDto } from './dto/wallet.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    getWallet(req: any): Promise<{
        transactions: {
            type: import("@prisma/client").$Enums.TransactionType;
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.TransactionStatus;
            amount: number;
            walletId: string;
            referenceId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
    deposit(req: any, dto: DepositDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
    withdraw(req: any, dto: WithdrawDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        balance: number;
        escrow: number;
    }>;
}
