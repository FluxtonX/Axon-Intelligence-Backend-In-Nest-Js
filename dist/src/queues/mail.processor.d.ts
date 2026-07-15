import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class MailProcessor extends WorkerHost {
    process(job: Job<any, any, string>): Promise<any>;
}
