import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async create(freelancerId: string, dto: CreateProposalDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project || project.status !== 'PUBLISHED') {
      throw new NotFoundException('Project not available for proposals');
    }

    // Check for existing proposal
    const existing = await this.prisma.proposal.findFirst({
      where: { projectId: dto.projectId, freelancerId },
    });
    if (existing) {
      throw new ConflictException('You have already submitted a proposal for this project');
    }

    return this.prisma.proposal.create({
      data: {
        ...dto,
        freelancerId,
      },
    });
  }

  async findByProject(projectId: string, clientId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.clientId !== clientId) {
      throw new ForbiddenException('You can only view proposals for your own projects');
    }

    return this.prisma.proposal.findMany({
      where: { projectId },
      include: { freelancer: { select: { id: true, profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptProposal(id: string, clientId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!proposal || proposal.project.clientId !== clientId) {
      throw new ForbiddenException('Cannot accept this proposal');
    }

    return this.prisma.$transaction(async (tx) => {
      // Mark proposal as accepted
      const accepted = await tx.proposal.update({
        where: { id },
        data: { status: 'ACCEPTED' },
      });

      // Reject all other proposals for this project
      await tx.proposal.updateMany({
        where: { projectId: proposal.projectId, id: { not: id } },
        data: { status: 'REJECTED' },
      });

      // Create a pending contract
      const contract = await tx.contract.create({
        data: {
          proposalId: proposal.id,
          projectId: proposal.projectId,
          clientId: clientId,
          freelancerId: proposal.freelancerId,
          amount: proposal.bidAmount,
          status: 'PENDING_PAYMENT',
        },
      });

      return contract;
    });
  }
}
