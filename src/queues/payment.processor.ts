import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('payment-queue')
export class PaymentProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing payment job: ${job.name} for contract ${job.data.contractId}`);
    // Fake payment reconciliation logic
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Successfully processed payment for contract ${job.data.contractId}`);
    return { success: true };
  }
}
