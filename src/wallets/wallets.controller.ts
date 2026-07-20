import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { DepositDto, WithdrawDto } from './dto/wallet.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('me')
  getWallet(@Request() req) {
    return this.walletsService.getWallet(req.user.id);
  }

  @Post('deposit')
  deposit(@Request() req, @Body() dto: DepositDto) {
    return this.walletsService.deposit(req.user.id, dto.amount);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body() dto: WithdrawDto) {
    return this.walletsService.withdraw(req.user.id, dto.amount);

  }


}
