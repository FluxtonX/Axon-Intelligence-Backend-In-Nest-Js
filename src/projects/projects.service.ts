import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...dto,
        clientId,
        status: 'PUBLISHED',
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limit,
        where: { status: 'PUBLISHED' },
        include: { client: { select: { id: true, profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where: { status: 'PUBLISHED' } }),
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

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { client: { select: { id: true, profile: true } }, proposals: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, clientId: string, dto: UpdateProjectDto) {
    const project = await this.findOne(id);
    if (project.clientId !== clientId) {
      throw new NotFoundException('Project not found or unauthorized');
    }
    
    if (project.status === 'IN_PROGRESS') {
      throw new Error('Cannot update an in-progress project');
    }

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }
}
