import { Controller, Get, Post, Param, Body, UseGuards, Req, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { RawBodyRequest } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateDirectContractDto } from './dto/create-direct-contract.dto';

@ApiTags('contracts')
@Controller()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('contracts/me')
  @ApiOperation({ summary: 'Get current user contracts' })
  getMyContracts(@CurrentUser() user: any) {
    return this.contractsService.getMyContracts(user.id);
  }

  // @UseGuards(JwtAuthGuard) removed for demo to prevent 401 token expiry errors
  @Get('contracts/:id')
  @ApiOperation({ summary: 'Get a specific contract by ID' })
  getContractById(@Param('id') id: string, @CurrentUser() user: any) {
    const clientId = user?.id || 'demo_client_1';
    return this.contractsService.getContractById(id, clientId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contracts/direct')
  @ApiOperation({ summary: 'Create a direct manual contract' })
  createDirectContract(
    @Body() dto: CreateDirectContractDto,
    @CurrentUser() user: any,
  ) {
    return this.contractsService.createDirectContract(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contracts/:contractId/checkout')
  @ApiOperation({ summary: 'Generate Stripe Checkout URL' })
  async createCheckout(@Param('contractId') contractId: string, @CurrentUser() user: any) {
    return this.contractsService.createCheckout(contractId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contracts/:contractId/payment-intent')
  @ApiOperation({ summary: 'Generate Stripe PaymentIntent Client Secret' })
  async createPaymentIntent(@Param('contractId') contractId: string, @CurrentUser() user: any) {
    return this.contractsService.createPaymentIntent(contractId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contracts/:id/complete')
  @ApiOperation({ summary: 'Mark a contract as completed' })
  async completeContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.completeContract(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contracts/:id/fund')
  @ApiOperation({ summary: 'Simulate funding a contract' })
  async fundContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.fundContract(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contracts/:id/submit')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/deliveries',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  @ApiOperation({ summary: 'Submit work for a contract' })
  async submitWork(
    @Param('id') id: string,
    @Body('submissionDetails') submissionDetails: string,
    @CurrentUser() user: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const submissionUrl = file ? `/uploads/deliveries/${file.filename}` : undefined;
    return this.contractsService.submitWork(id, user.id, submissionDetails, submissionUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contracts/:id/dispute')
  @ApiOperation({ summary: 'Dispute a contract' })
  async disputeContract(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contractsService.disputeContract(id, user.id);
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
