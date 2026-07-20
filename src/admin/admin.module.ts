import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { WalletsModule } from '../wallets/wallets.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [WalletsModule, DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
