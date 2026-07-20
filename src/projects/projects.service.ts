import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, dto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({
        data: {
          ...dto,
          clientId,
          status: 'PUBLISHED',
        },
      });
    } catch (error: any) {
      console.error('Project Create Error:', error);
      throw new BadRequestException(`Failed to create project: ${error.message || error}`);
    }
  }

  async findAll(
    q?: string,
    skip: number = 0,
    take: number = 20,
    minBudget?: number,
    maxBudget?: number,
  ) {
    const where: any = { status: 'PUBLISHED' };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (minBudget !== undefined || maxBudget !== undefined) {
      where.budget = {};
      if (minBudget !== undefined) where.budget.gte = minBudget;
      if (maxBudget !== undefined) where.budget.lte = maxBudget;
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take,
        include: { client: { select: { id: true, profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  async findAllByClient(clientId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limit,
        where: { clientId },
        include: { proposals: true, client: { select: { id: true, profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where: { clientId } }),
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
      throw new BadRequestException('Cannot update an in-progress project');
    }

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async handleAiChat(step: number, message: string) {
    // Simulated AI Backend Logic
    let text = '';
    let options: string[] | undefined = undefined;
    let status = 'waitingForInput';
    let generatedBrief: any = undefined;

    if (step === 0) {
      text = "Got it! What's your estimated budget for this project?";
      options = ["<$500", "$500 - $2000", "$2000+"];
    } else if (step === 1) {
      text = "Understood. When do you need this delivered?";
      options = ["ASAP", "1 Week", "1 Month"];
    } else if (step === 2) {
      text = "Perfect. Any specific skills or frameworks the freelancer must know? (e.g., Flutter, Node.js)";
      options = ["Flutter & Firebase", "React Native", "Native iOS/Android", "Not sure, you decide"];
    } else {
      status = 'complete';
      text = "Your project brief has been generated successfully.";
      generatedBrief = {
        title: "New AI Generated Project",
        description: "Based on our conversation, you need a high-quality application with a quick turnaround. Requirements have been scoped and finalized.",
        budget: 1500,
        timeline: "1 Week",
        skills: ["Flutter", "Node.js", "Firebase"]
      };
    }

    return { text, options, status, generatedBrief };
  }
}
