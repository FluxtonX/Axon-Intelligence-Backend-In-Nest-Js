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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(clientId, dto) {
        try {
            return await this.prisma.project.create({
                data: {
                    ...dto,
                    clientId,
                    status: 'PUBLISHED',
                },
            });
        }
        catch (error) {
            console.error('Project Create Error:', error);
            throw new common_1.BadRequestException(`Failed to create project: ${error.message || error}`);
        }
    }
    async findAll(q, skip = 0, take = 20, minBudget, maxBudget, freelancerId) {
        const where = { status: 'PUBLISHED' };
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (minBudget !== undefined || maxBudget !== undefined) {
            where.budget = {};
            if (minBudget !== undefined)
                where.budget.gte = minBudget;
            if (maxBudget !== undefined)
                where.budget.lte = maxBudget;
        }
        if (freelancerId) {
            where.proposals = { none: { freelancerId } };
        }
        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                skip,
                take,
                include: { client: { select: { id: true, profile: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.project.count({ where }),
        ]);
        return { projects, total };
    }
    async findAllByClient(clientId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                skip,
                take: limit,
                where: { clientId },
                include: { proposals: true, client: { select: { id: true, profile: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.project.count({ where: { clientId } }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { client: { select: { id: true, profile: true } }, proposals: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async update(id, clientId, dto) {
        const project = await this.findOne(id);
        if (project.clientId !== clientId) {
            throw new common_1.NotFoundException('Project not found or unauthorized');
        }
        if (project.status === 'IN_PROGRESS') {
            throw new common_1.BadRequestException('Cannot update an in-progress project');
        }
        return this.prisma.project.update({
            where: { id },
            data: dto,
        });
    }
    async handleAiChat(step, message) {
        let text = '';
        let options = undefined;
        let status = 'waitingForInput';
        let generatedBrief = undefined;
        if (step === 0) {
            text = "Got it! What's your estimated budget for this project?";
            options = ["<$500", "$500 - $2000", "$2000+"];
        }
        else if (step === 1) {
            text = "Understood. When do you need this delivered?";
            options = ["ASAP", "1 Week", "1 Month"];
        }
        else if (step === 2) {
            text = "Perfect. Any specific skills or frameworks the freelancer must know? (e.g., Flutter, Node.js)";
            options = ["Flutter & Firebase", "React Native", "Native iOS/Android", "Not sure, you decide"];
        }
        else {
            status = 'complete';
            text = "Your project brief has been generated successfully.";
            generatedBrief = {
                title: "New AI Generated Project",
                description: "Based on our conversation, you need a high-quality application with a quick turnaround. Requirements have been scoped and finalized.",
                budget: 1500,
                timeline: "1 Week",
                skills: ["Flutter", "Node.js", "Firebase"]
            };
        }
        return { text, options, status, generatedBrief };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map