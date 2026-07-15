import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Submit a review for a completed contract' })
  createReview(@Body() dto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewsService.createReview(user.id, dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reviews received by a user' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  getReviewsForUser(
    @Param('userId') userId: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.reviewsService.getReviewsForUser(userId, Number(skip) || 0, Number(take) || 10);
  }
}
