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
const notifications_service_1 = require("../notifications/notifications.service");
let ContractsService = class ContractsService {
    prisma;
    walletsService;
    notificationsService;
    stripe;
    constructor(prisma, walletsService, notificationsService) {
        this.prisma = prisma;
        this.walletsService = walletsService;
        this.notificationsService = notificationsService;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
            apiVersion: '2023-10-16',
        });
    }
    async createDirectContract(clientId, dto) {
        let freelancer = await this.prisma.user.findUnique({ where: { id: dto.freelancerId } });
        if (!freelancer) {
            freelancer = await this.prisma.user.create({
                data: {
                    id: dto.freelancerId,
                    email: `${dto.freelancerId}@axon-mock.com`,
                    role: 'USER',
                    profile: {
                        create: {
                            firstName: 'Demo',
                            lastName: 'Freelancer',
                        }
                    }
                }
            });
        }
        let client = await this.prisma.user.findUnique({ where: { id: clientId } });
        if (!client) {
            client = await this.prisma.user.create({
                data: {
                    id: clientId,
                    email: `${clientId}@axon-client-mock.com`,
                    role: 'USER',
                    profile: {
                        create: {
                            firstName: 'Demo',
                            lastName: 'Client',
                        }
                    }
                }
            });
        }
        const project = await this.prisma.project.create({
            data: {
                clientId,
                title: dto.title,
                description: dto.description,
                budget: dto.amount,
                status: 'PUBLISHED',
            },
        });
        const contract = await this.prisma.contract.create({
            data: {
                projectId: project.id,
                clientId,
                freelancerId: dto.freelancerId,
                amount: dto.amount,
                status: 'PENDING_PAYMENT',
                deadline: new Date(Date.now() + (dto.deliveryDays || 3) * 24 * 60 * 60 * 1000),
            },
        });
        this.notificationsService.sendNotification(dto.freelancerId, 'New Contract Offered', `You have received a direct contract offer for "${project.title}"`, 'CONTRACT');
        return contract;
    }
    async createCheckout(contractId, clientId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
            include: { project: true, proposal: true },
        });
        if (!contract) {
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
    async createPaymentIntent(contractId, clientId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
            include: { project: true },
        });
        if (!contract) {
            throw new common_1.ForbiddenException('Cannot access this contract');
        }
        if (contract.status !== 'PENDING_PAYMENT') {
            throw new common_1.BadRequestException('Contract is already active or paid');
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(contract.amount * 100),
            currency: 'usd',
            metadata: { contractId: contract.id },
        });
        return { clientSecret: paymentIntent.client_secret };
    }
    async completeContract(contractId, clientId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract) {
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
            this.notificationsService.sendNotification(contract.freelancerId, 'Contract Completed', 'Your contract has been completed and funds have been released to your wallet!', 'CONTRACT');
            return updatedContract;
        });
    }
    async fundContract(contractId, clientId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract) {
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
            this.notificationsService.sendNotification(contract.freelancerId, 'Contract Funded', 'The client has funded the contract. You can now start working!', 'CONTRACT');
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
                project: {
                    include: { client: { select: { id: true, profile: true } } },
                },
                proposal: {
                    include: { freelancer: { select: { id: true, profile: true } } }
                },
                reviews: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getContractById(contractId, userId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
            include: {
                project: {
                    include: { client: { select: { id: true, profile: true } } },
                },
                proposal: {
                    include: { freelancer: { select: { id: true, profile: true } } }
                },
                reviews: true,
            },
        });
        if (!contract) {
            throw new common_1.NotFoundException('Contract not found');
        }
        return contract;
    }
    async submitWork(contractId, freelancerId, submissionDetails, submissionUrl) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract) {
            throw new common_1.ForbiddenException('Cannot access this contract');
        }
        if (contract.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Only ACTIVE contracts can be submitted');
        }
        const updated = await this.prisma.contract.update({
            where: { id: contractId },
            data: {
                status: 'SUBMITTED',
                submissionNotes: submissionDetails,
                submissionUrl: submissionUrl,
            },
        });
        this.notificationsService.sendNotification(contract.clientId, 'Work Submitted', 'The freelancer has submitted work for your contract. Please review it.', 'CONTRACT');
        return updated;
    }
    async requestRevision(contractId, clientId, notes) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract) {
            throw new common_1.ForbiddenException('Cannot access this contract');
        }
        if (contract.status !== 'SUBMITTED') {
            throw new common_1.BadRequestException('Only SUBMITTED contracts can be revised');
        }
        const updated = await this.prisma.contract.update({
            where: { id: contractId },
            data: {
                status: 'ACTIVE',
                submissionNotes: null,
                submissionUrl: null,
            },
        });
        await this.prisma.message.create({
            data: {
                senderId: clientId,
                receiverId: contract.freelancerId,
                content: `**Revision Requested**\n${notes}`,
            }
        });
        this.notificationsService.sendNotification(contract.freelancerId, 'Revision Requested', 'The client has requested a revision. Please check messages for details.', 'CONTRACT');
        return updated;
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
        else if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const contractId = paymentIntent.metadata.contractId;
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
        wallets_service_1.WalletsService,
        notifications_service_1.NotificationsService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map