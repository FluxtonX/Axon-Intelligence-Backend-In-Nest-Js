import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { DatabaseModule } from '../database/database.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [DatabaseModule, WalletsModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
