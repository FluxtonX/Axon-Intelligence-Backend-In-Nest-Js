import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MessagesGateway],
})
export class MessagesModule {}
