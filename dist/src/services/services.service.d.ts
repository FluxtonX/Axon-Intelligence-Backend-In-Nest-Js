import { PrismaService } from '../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(freelancerId: string, dto: CreateServiceDto): Promise<{
        id: string;
        title: string;
        category: string;
        description: string;
        price: number;
        deliveryDays: number;
        imageUrl: string | null;
        createdAt: Date;
        freelancerId: string;
    }>;
    findAll(q?: string, skip?: number, take?: number): Promise<{
        services: ({
            freelancer: {
                id: string;
                profile: {
                    id: string;
                    title: string | null;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    bio: string | null;
                    hourlyRate: number | null;
                    skills: string[];
                    averageRating: number | null;
                    totalReviews: number;
                } | null;
            };
        } & {
            id: string;
            title: string;
            category: string;
            description: string;
            price: number;
            deliveryDays: number;
            imageUrl: string | null;
            createdAt: Date;
            freelancerId: string;
        })[];
        total: number;
    }>;
    findByFreelancer(freelancerId: string): Promise<{
        id: string;
        title: string;
        category: string;
        description: string;
        price: number;
        deliveryDays: number;
        imageUrl: string | null;
        createdAt: Date;
        freelancerId: string;
    }[]>;
    update(id: string, freelancerId: string, dto: UpdateServiceDto): Promise<{
        id: string;
        title: string;
        category: string;
        description: string;
        price: number;
        deliveryDays: number;
        imageUrl: string | null;
        createdAt: Date;
        freelancerId: string;
    }>;
}
