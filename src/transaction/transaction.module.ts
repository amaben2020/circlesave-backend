import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionHistories } from 'src/entities/transactionHistories';
import { WalletModule } from 'src/wallet/wallet.module';
import { Wallet } from 'src/entities/wallet.entity';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionHistories, Wallet]),
    WalletModule,
  ],
})
export class TransactionModule {}
