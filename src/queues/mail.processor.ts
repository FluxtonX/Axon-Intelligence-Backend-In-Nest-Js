import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing mail job: ${job.name} for ${job.data.email}`);
    // Fake email sending logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Successfully sent email to ${job.data.email}`);
    return { success: true };
  }
}
