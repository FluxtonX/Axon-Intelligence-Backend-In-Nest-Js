import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(user: any, createServiceDto: CreateServiceDto): Promise<{
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
    findMyServices(user: any): Promise<{
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
    update(id: string, user: any, updateServiceDto: UpdateServiceDto): Promise<{
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
