import { PrismaService } from '../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(freelancerId: string, dto: CreateServiceDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        deliveryDays: number;
        freelancerId: string;
        category: string;
        price: number;
        imageUrl: string | null;
    }>;
    findAll(q?: string, skip?: number, take?: number): Promise<{
        services: ({
            freelancer: {
                id: string;
                profile: {
                    id: string;
                    title: string | null;
                    skills: string[];
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    bio: string | null;
                    hourlyRate: number | null;
                    averageRating: number | null;
                    totalReviews: number;
                    userId: string;
                } | null;
            };
        } & {
            id: string;
            createdAt: Date;
            title: string;
            description: string;
            deliveryDays: number;
            freelancerId: string;
            category: string;
            price: number;
            imageUrl: string | null;
        })[];
        total: number;
    }>;
    findByFreelancer(freelancerId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        deliveryDays: number;
        freelancerId: string;
        category: string;
        price: number;
        imageUrl: string | null;
    }[]>;
    update(id: string, freelancerId: string, dto: UpdateServiceDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        deliveryDays: number;
        freelancerId: string;
        category: string;
        price: number;
        imageUrl: string | null;
    }>;
}
