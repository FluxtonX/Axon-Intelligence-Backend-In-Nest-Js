"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const wallets_service_1 = require("../wallets/wallets.service");
const stripe_1 = __importDefault(require("stripe"));
let ContractsService = class ContractsService {
    prisma;
    walletsService;
    stripe;
    constructor(prisma, walletsService) {
        this.prisma = prisma;
        this.walletsService = walletsService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckout(proposalId, clientId) {
        const contract = await this.prisma.contract.findUnique({
            where: { proposalId },
            include: { project: true, proposal: true },
        });
        if (!contract || contract.clientId !== clientId) {
            throw new common_1.ForbiddenException('Cannot access this contract');
        }
        if (contract.status !== 'PENDING_PAYMENT') {
            throw new common_1.BadRequestException('Contract is already active or paid');
        }
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Contract for Project: ${contract.project.title}`,
                        },
                        unit_amount: Math.round(contract.amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/contracts/${contract.id}/success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/contracts/${contract.id}/cancel`,
            client_reference_id: contract.id,
        });
        return { url: session.url };
    }
    async completeContract(contractId, clientId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract || contract.clientId !== clientId) {
            throw new common_1.ForbiddenException('Cannot access this contract or you are not the client');
        }
        if (contract.status !== 'ACTIVE' && contract.status !== 'SUBMITTED') {
            throw new common_1.BadRequestException('Only ACTIVE or SUBMITTED contracts can be completed');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedContract = await tx.contract.update({
                where: { id: contractId },
                data: { status: 'COMPLETED' },
            });
            await tx.project.update({
                where: { id: contract.projectId },
                data: { status: 'COMPLETED' },
            });
            await this.walletsService.releaseEscrowToEarnings(contract.freelancerId, contract.clientId, contract.amount, contract.id);
            return updatedContract;
        });
    }
    async fundContract(contractId, clientId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract || contract.clientId !== clientId) {
            throw new common_1.ForbiddenException('Cannot access this contract');
        }
        if (contract.status !== 'PENDING_PAYMENT') {
            throw new common_1.BadRequestException('Contract is already active or paid');
        }
        await this.walletsService.deposit(clientId, contract.amount);
        await this.walletsService.lockEscrow(clientId, contract.amount, contract.id);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.contract.update({
                where: { id: contractId },
                data: { status: 'ACTIVE' },
            });
            await tx.project.update({
                where: { id: contract.projectId },
                data: { status: 'IN_PROGRESS' },
            });
            return updated;
        });
    }
    async getMyContracts(userId) {
        return this.prisma.contract.findMany({
            where: {
                OR: [
                    { clientId: userId },
                    { freelancerId: userId },
                ],
            },
            include: {
                project: true,
                proposal: {
                    include: { freelancer: { select: { id: true, profile: true } } }
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async submitWork(contractId, freelancerId, submissionDetails) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract || contract.freelancerId !== freelancerId) {
            throw new common_1.ForbiddenException('Cannot access this contract');
        }
        if (contract.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Only ACTIVE contracts can be submitted');
        }
        return this.prisma.contract.update({
            where: { id: contractId },
            data: { status: 'SUBMITTED' },
        });
    }
    async disputeContract(contractId, userId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract || (contract.clientId !== userId && contract.freelancerId !== userId)) {
            throw new common_1.ForbiddenException('Cannot access this contract');
        }
        if (contract.status !== 'ACTIVE' && contract.status !== 'SUBMITTED') {
            throw new common_1.BadRequestException('Only ACTIVE or SUBMITTED contracts can be disputed');
        }
        return this.prisma.contract.update({
            where: { id: contractId },
            data: { status: 'DISPUTED' },
        });
    }
    async handleStripeWebhook(signature, payload) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const contractId = session.client_reference_id;
            if (contractId) {
                await this.prisma.$transaction(async (tx) => {
                    const contract = await tx.contract.update({
                        where: { id: contractId },
                        data: { status: 'ACTIVE' },
                    });
                    await tx.project.update({
                        where: { id: contract.projectId },
                        data: { status: 'IN_PROGRESS' },
                    });
                });
            }
        }
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wallets_service_1.WalletsService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map