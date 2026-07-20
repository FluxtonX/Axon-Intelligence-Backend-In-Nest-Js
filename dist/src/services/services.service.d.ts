import { PrismaService } from '../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(freelancerId: string, dto: CreateServiceDto): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        freelancerId: string;
        deliveryDays: number;
        category: string;
        price: number;
        imageUrl: string | null;
    }>;
    findAll(q?: string, skip?: number, take?: number): Promise<{
        services: ({
            freelancer: {
                profile: {
                    title: string | null;
                    firstName: string;
                    lastName: string;
                    id: string;
                    avatarUrl: string | null;
                    bio: string | null;
                    hourlyRate: number | null;
                    skills: string[];
                    averageRating: number | null;
                    totalReviews: number;
                    userId: string;
                } | null;
                id: string;
            };
        } & {
            description: string;
            title: string;
            id: string;
            createdAt: Date;
            freelancerId: string;
            deliveryDays: number;
            category: string;
            price: number;
            imageUrl: string | null;
        })[];
        total: number;
    }>;
    findByFreelancer(freelancerId: string): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        freelancerId: string;
        deliveryDays: number;
        category: string;
        price: number;
        imageUrl: string | null;
    }[]>;
    update(id: string, freelancerId: string, dto: UpdateServiceDto): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        freelancerId: string;
        deliveryDays: number;
        category: string;
        price: number;
        imageUrl: string | null;
    }>;
}
