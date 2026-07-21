import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('proposals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a proposal to a project' })
  create(@CurrentUser() user: any, @Body() createProposalDto: CreateProposalDto) {
    return this.proposalsService.create(user.id, createProposalDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Freelancer views their submitted proposals' })
  findMyProposals(@CurrentUser() user: any) {
    return this.proposalsService.findMyProposals(user.id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Client views proposals for their project' })
  findByProject(@Param('projectId') projectId: string, @CurrentUser() user: any) {
    return this.proposalsService.findByProject(projectId, user.id);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Client accepts a proposal' })
  acceptProposal(@Param('id') id: string, @CurrentUser() user: any) {
    return this.proposalsService.acceptProposal(id, user.id);
  }
}
