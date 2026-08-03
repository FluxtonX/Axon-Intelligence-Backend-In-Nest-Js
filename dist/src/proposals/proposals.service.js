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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ProposalsService = class ProposalsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(freelancerId, dto) {
        const project = await this.prisma.project.findUnique({
            where: { id: dto.projectId },
        });
        if (!project || project.status !== 'PUBLISHED') {
            throw new common_1.NotFoundException('Project not available for proposals');
        }
        const existing = await this.prisma.proposal.findFirst({
            where: { projectId: dto.projectId, freelancerId },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already submitted a proposal for this project');
        }
        const proposal = await this.prisma.proposal.create({
            data: {
                ...dto,
                freelancerId,
            },
        });
        this.notificationsService.sendNotification(project.clientId, 'New Proposal Received', `A freelancer has submitted a new proposal for "${project.title}"`, 'PROPOSAL');
        return proposal;
    }
    async findMyProposals(freelancerId) {
        return this.prisma.proposal.findMany({
            where: { freelancerId },
            include: { project: { select: { title: true, client: { select: { profile: true } } } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByProject(projectId, clientId) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.clientId !== clientId) {
            throw new common_1.ForbiddenException('You can only view proposals for your own projects');
        }
        return this.prisma.proposal.findMany({
            where: { projectId },
            include: { freelancer: { select: { id: true, profile: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async acceptProposal(id, clientId) {
        const proposal = await this.prisma.proposal.findUnique({
            where: { id },
            include: { project: true },
        });
        if (!proposal || proposal.project.clientId !== clientId) {
            throw new common_1.ForbiddenException('Cannot accept this proposal');
        }
        return this.prisma.$transaction(async (tx) => {
            const accepted = await tx.proposal.update({
                where: { id },
                data: { status: 'ACCEPTED' },
            });
            await tx.proposal.updateMany({
                where: { projectId: proposal.projectId, id: { not: id } },
                data: { status: 'REJECTED' },
            });
            await tx.project.update({
                where: { id: proposal.projectId },
                data: { status: 'IN_PROGRESS' },
            });
            const contract = await tx.contract.create({
                data: {
                    proposalId: proposal.id,
                    projectId: proposal.projectId,
                    clientId: clientId,
                    freelancerId: proposal.freelancerId,
                    amount: proposal.bidAmount,
                    status: 'PENDING_PAYMENT',
                    deadline: new Date(Date.now() + proposal.deliveryDays * 24 * 60 * 60 * 1000),
                },
            });
            this.notificationsService.sendNotification(proposal.freelancerId, 'Proposal Accepted', `Your proposal for "${proposal.project.title}" was accepted!`, 'PROPOSAL');
            return contract;
        });
    }
};
exports.ProposalsService = ProposalsService;
exports.ProposalsService = ProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ProposalsService);
//# sourceMappingURL=proposals.service.js.map