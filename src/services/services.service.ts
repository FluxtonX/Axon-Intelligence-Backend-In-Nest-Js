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

  async findAll(q?: string, skip: number = 0, take: number = 20) {
    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take,
        include: { freelancer: { select: { id: true, profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    return { services, total };
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
