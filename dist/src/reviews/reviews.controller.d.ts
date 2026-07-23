import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(dto: CreateReviewDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        contractId: string;
        rating: number;
        comment: string | null;
        reviewerId: string;
        revieweeId: string;
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
        rating: number;
        comment: string | null;
        reviewerId: string;
        revieweeId: string;
    })[]>;
}
