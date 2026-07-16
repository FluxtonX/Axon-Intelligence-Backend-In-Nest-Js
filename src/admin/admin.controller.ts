import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  getUsers(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
  ) {
    return this.adminService.getUsers(skip, take);
  }

  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend or unsuspend a user' })
  suspendUser(
    @Param('id') id: string,
    @Body('isSuspended') isSuspended: boolean,
  ) {
    return this.adminService.suspendUser(id, isSuspended);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get platform metrics' })
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Post('disputes/:id/resolve')
  @ApiOperation({ summary: 'Resolve a disputed contract' })
  resolveDispute(
    @Param('id') id: string,
    @Body('refundClientPercentage', ParseIntPipe) refundClientPercentage: number,
  ) {
    return this.adminService.resolveDispute(id, refundClientPercentage);
  }
}
