import { Controller, Get, Patch, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/client-dashboard')
  @ApiOperation({ summary: 'Get aggregated data for client dashboard' })
  getClientDashboard(@CurrentUser() user: any) {
    return this.usersService.getClientDashboard(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
    return this.usersService.updateProfile(user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/device-token')
  @ApiOperation({ summary: 'Update current user FCM device token' })
  updateDeviceToken(@CurrentUser() user: any, @Body('token') token: string) {
    return this.usersService.updateDeviceToken(user.id, token);
  }

  @Get('freelancers')
  @ApiOperation({ summary: 'Search for freelancers' })
  searchFreelancers(
    @Query('q') q?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('maxHourlyRate') maxHourlyRate?: string,
  ) {
    return this.usersService.searchFreelancers(
      q,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
      maxHourlyRate ? parseFloat(maxHourlyRate) : undefined,
    );
  }
}
