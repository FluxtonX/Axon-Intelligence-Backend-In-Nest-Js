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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ReviewsService = class ReviewsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createReview(reviewerId, dto) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: dto.contractId },
        });
        if (!contract) {
            throw new common_1.BadRequestException('Contract not found');
        }
        if (contract.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Reviews can only be submitted for COMPLETED contracts');
        }
        let revieweeId;
        if (contract.clientId === reviewerId) {
            revieweeId = contract.freelancerId;
        }
        else if (contract.freelancerId === reviewerId) {
            revieweeId = contract.clientId;
        }
        else {
            if (!dto.revieweeId) {
                throw new common_1.BadRequestException('revieweeId is required when you are not part of the contract');
            }
            revieweeId = dto.revieweeId;
        }
        const existingReview = await this.prisma.review.findUnique({
            where: {
                contractId_reviewerId: {
                    contractId: dto.contractId,
                    reviewerId,
                },
            },
        });
        if (existingReview) {
            throw new common_1.ConflictException('You have already reviewed this contract');
        }
        return this.prisma.$transaction(async (tx) => {
            const review = await tx.review.create({
                data: {
                    contractId: dto.contractId,
                    reviewerId,
                    revieweeId,
                    rating: dto.rating,
                    comment: dto.comment,
                },
            });
            const aggregations = await tx.review.aggregate({
                where: { revieweeId },
                _avg: { rating: true },
                _count: { rating: true },
            });
            const newAverageRating = aggregations._avg.rating || 0;
            const newTotalReviews = aggregations._count.rating || 0;
            await tx.profile.update({
                where: { userId: revieweeId },
                data: {
                    averageRating: newAverageRating,
                    totalReviews: newTotalReviews,
                },
            });
            this.notificationsService.sendNotification(revieweeId, 'New Review Received!', `You received a ${dto.rating}-star review for your recent contract.`, 'CONTRACT');
            return review;
        });
    }
    async getReviewsForUser(userId, skip = 0, take = 10) {
        return this.prisma.review.findMany({
            where: { revieweeId: userId },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map