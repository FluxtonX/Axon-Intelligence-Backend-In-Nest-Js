import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new service gig' })
  create(@CurrentUser() user: any, @Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(user.id, createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'List services for discover page' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  findAll(
    @Query('page') page?: string, 
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.servicesService.findAll(page ? +page : 1, limit ? +limit : 10, category);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current freelancer services' })
  findMyServices(@CurrentUser() user: any) {
    return this.servicesService.findByFreelancer(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, user.id, updateServiceDto);
  }
}
