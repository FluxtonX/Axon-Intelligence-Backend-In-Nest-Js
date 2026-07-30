import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ReviewsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createReview(reviewerId: string, dto: CreateReviewDto): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        contractId: string;
        reviewerId: string;
        revieweeId: string;
    }>;
    getReviewsForUser(userId: string, skip?: number, take?: number): Promise<({
        reviewer: {
            profile: {
                firstName: string;
                lastName: string;
                avatarUrl: string | null;
            } | null;
            id: string;
        };
    } & {
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        contractId: string;
        reviewerId: string;
        revieweeId: string;
    })[]>;
}
