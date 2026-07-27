import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(user: any, createServiceDto: CreateServiceDto): Promise<{
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
                    userId: string;
                    firstName: string;
                    lastName: string;
                    avatarUrl: string | null;
                    bio: string | null;
                    title: string | null;
                    hourlyRate: number | null;
                    skills: string[];
                    averageRating: number | null;
                    totalReviews: number;
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
    findMyServices(user: any): Promise<{
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
    update(id: string, user: any, updateServiceDto: UpdateServiceDto): Promise<{
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
