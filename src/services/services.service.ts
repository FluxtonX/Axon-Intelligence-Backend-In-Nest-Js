import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(freelancerId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...dto,
        freelancerId,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, category?: string) {
    const skip = (page - 1) * limit;
    
    const whereClause = category ? { category } : {};

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: { freelancer: { select: { id: true, profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count({ where: whereClause }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByFreelancer(freelancerId: string) {
    return this.prisma.service.findMany({
      where: { freelancerId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, freelancerId: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service || service.freelancerId !== freelancerId) {
      throw new NotFoundException('Service not found or unauthorized');
    }

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }
}
