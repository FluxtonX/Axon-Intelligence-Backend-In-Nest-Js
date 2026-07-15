import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import Stripe from 'stripe';

@Injectable()
export class ContractsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
      apiVersion: '2023-10-16' as any,
    });
  }

  async createCheckout(proposalId: string, clientId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { proposalId },
      include: { project: true, proposal: true },
    });

    if (!contract || contract.clientId !== clientId) {
      throw new ForbiddenException('Cannot access this contract');
    }

    if (contract.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('Contract is already active or paid');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Contract for Project: ${contract.project.title}`,
            },
            unit_amount: Math.round(contract.amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/contracts/${contract.id}/success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/contracts/${contract.id}/cancel`,
      client_reference_id: contract.id,
    });

    return { url: session.url };
  }

  async completeContract(contractId: string, clientId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract || contract.clientId !== clientId) {
      throw new ForbiddenException('Cannot access this contract or you are not the client');
    }

    if (contract.status !== 'ACTIVE') {
      throw new BadRequestException('Only ACTIVE contracts can be completed');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: { status: 'COMPLETED' },
      });

      await tx.project.update({
        where: { id: contract.projectId },
        data: { status: 'COMPLETED' },
      });

      // Release escrow to freelancer earnings
      await this.walletsService.releaseEscrowToEarnings(
        contract.freelancerId,
        contract.clientId,
        contract.amount,
        contract.id
      );

      return updatedContract;
    });
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
      );
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const contractId = session.client_reference_id;

      if (contractId) {
        // Mark contract as active and project as in progress
        await this.prisma.$transaction(async (tx) => {
          const contract = await tx.contract.update({
            where: { id: contractId },
            data: { status: 'ACTIVE' },
          });

          await tx.project.update({
            where: { id: contract.projectId },
            data: { status: 'IN_PROGRESS' },
          });
        });
      }
    }
  }
}
