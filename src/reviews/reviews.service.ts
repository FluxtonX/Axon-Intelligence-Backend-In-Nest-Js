import { Injectable, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(reviewerId: string, dto: CreateReviewDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: dto.contractId },
    });

    if (!contract) {
      throw new BadRequestException('Contract not found');
    }

    if (contract.status !== 'COMPLETED') {
      throw new BadRequestException('Reviews can only be submitted for COMPLETED contracts');
    }

    // Determine the reviewee based on who is leaving the review
    let revieweeId: string;
    if (contract.clientId === reviewerId) {
      revieweeId = contract.freelancerId;
    } else if (contract.freelancerId === reviewerId) {
      revieweeId = contract.clientId;
    } else {
      throw new ForbiddenException('You are not part of this contract');
    }

    // Check if the user already reviewed this contract
    const existingReview = await this.prisma.review.findUnique({
      where: {
        contractId_reviewerId: {
          contractId: dto.contractId,
          reviewerId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this contract');
    }

    // Create the review and update the reviewee's average rating in a transaction
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

      // Calculate the new average rating
      const aggregations = await tx.review.aggregate({
        where: { revieweeId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const newAverageRating = aggregations._avg.rating || 0;
      const newTotalReviews = aggregations._count.rating || 0;

      // Update the user's profile
      await tx.profile.update({
        where: { userId: revieweeId },
        data: {
          averageRating: newAverageRating,
          totalReviews: newTotalReviews,
        },
      });

      return review;
    });
  }

  async getReviewsForUser(userId: string, skip: number = 0, take: number = 10) {
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
}
