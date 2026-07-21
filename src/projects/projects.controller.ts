import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@CurrentUser() user: any, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('ai/chat')
  @ApiOperation({ summary: 'Chat with AI to generate a project brief' })
  handleAiChat(@Body('step') step: number, @Body('message') message: string) {
    return this.projectsService.handleAiChat(step, message);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all published projects (with search and pagination)' })
  findAll(
    @CurrentUser() user: any,
    @Query('q') q?: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take?: number,
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
  ) {
    return this.projectsService.findAll(
      q,
      skip,
      take,
      minBudget ? parseFloat(minBudget) : undefined,
      maxBudget ? parseFloat(maxBudget) : undefined,
      user?.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'List projects created by current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMyProjects(@CurrentUser() user: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.projectsService.findAllByClient(user.id, page ? +page : 1, limit ? +limit : 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific project' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, user.id, updateProjectDto);
  }
}
