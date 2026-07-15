import { Controller, Post, Param, UseGuards, Req, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('contracts')
@Controller()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('contracts/:proposalId/checkout')
  @ApiOperation({ summary: 'Generate Stripe Checkout URL' })
  createCheckout(@Param('proposalId') proposalId: string, @CurrentUser() user: any) {
    return this.contractsService.createCheckout(proposalId, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('contracts/:id/complete')
  @ApiOperation({ summary: 'Mark a contract as completed' })
  completeContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.completeContract(id, user.id);
  }

  @Post('payments/webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature || !req.rawBody) {
      return { received: true };
    }
    await this.contractsService.handleStripeWebhook(signature, req.rawBody);
    return { received: true };
  }
}
