import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/entities/wallet.entity';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [TypeOrmModule.forFeature([Wallet])],
  exports: [WalletService],
})
export class WalletModule {}
