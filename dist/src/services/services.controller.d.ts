import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(user: any, createServiceDto: CreateServiceDto): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        category: string;
        price: number;
        deliveryDays: number;
        imageUrl: string | null;
        freelancerId: string;
    }>;
    findAll(page?: string, limit?: string, category?: string): Promise<{
        data: ({
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
            category: string;
            price: number;
            deliveryDays: number;
            imageUrl: string | null;
            freelancerId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findMyServices(user: any): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        category: string;
        price: number;
        deliveryDays: number;
        imageUrl: string | null;
        freelancerId: string;
    }[]>;
    update(id: string, user: any, updateServiceDto: UpdateServiceDto): Promise<{
        description: string;
        title: string;
        id: string;
        createdAt: Date;
        category: string;
        price: number;
        deliveryDays: number;
        imageUrl: string | null;
        freelancerId: string;
    }>;
}
