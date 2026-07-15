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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(freelancerId, dto) {
        return this.prisma.service.create({
            data: {
                ...dto,
                freelancerId,
            },
        });
    }
    async findAll(page = 1, limit = 10, category) {
        const skip = (page - 1) * limit;
        const whereClause = category ? { category } : {};
        const [data, total] = await Promise.all([
            this.prisma.service.findMany({
                skip,
                take: limit,
                where: whereClause,
                include: { freelancer: { select: { id: true, profile: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.service.count({ where: whereClause }),
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
    async findByFreelancer(freelancerId) {
        return this.prisma.service.findMany({
            where: { freelancerId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async update(id, freelancerId, dto) {
        const service = await this.prisma.service.findUnique({ where: { id } });
        if (!service || service.freelancerId !== freelancerId) {
            throw new common_1.NotFoundException('Service not found or unauthorized');
        }
        return this.prisma.service.update({
            where: { id },
            data: dto,
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map