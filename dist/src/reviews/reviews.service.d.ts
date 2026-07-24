import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(reviewerId: string, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        contractId: string;
        revieweeId: string;
        rating: number;
        comment: string | null;
        reviewerId: string;
    }>;
    getReviewsForUser(userId: string, skip?: number, take?: number): Promise<({
        reviewer: {
            id: string;
            profile: {
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        contractId: string;
        revieweeId: string;
        rating: number;
        comment: string | null;
        reviewerId: string;
    })[]>;
}
