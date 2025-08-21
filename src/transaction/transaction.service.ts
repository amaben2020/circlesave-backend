import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/entities/transaction.entity';

import { User } from 'src/entities/user.entity';
import { Wallet } from 'src/entities/wallet.entity';
import { TransactionHistories } from 'src/entities/transactionHistories.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(TransactionHistories)
    private readonly historyRepo: Repository<TransactionHistories>,

    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
  ) {}

  /**
   * Create a new transaction (FUNDING or WITHDRAWAL)
   */
  async createTransaction(data: {
    type: TransactionType;
    amount: number;
    currency: string;
    userId: number;
    reference?: string;
    providerResponse?: string;
  }): Promise<Transaction> {
    const user = { id: data.userId } as User;

    const transaction = this.transactionRepo.create({
      ...data,
      status: TransactionStatus.PENDING,
      user,
    });

    return this.transactionRepo.save(transaction);
  }

  /**
   * Mark a transaction as successful/failed, update wallet,
   * and log in TransactionHistories
   */
  async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
    providerResponse?: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
      relations: ['user'],
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    const wallet = await this.walletRepo.findOneBy({
      user: { id: transaction.user.id },
    });
    if (!wallet) throw new NotFoundException('Wallet not found for user');

    const balanceBefore = wallet.balance;

    if (status === TransactionStatus.SUCCESS) {
      if (transaction.type === TransactionType.FUNDING) {
        wallet.balance += Number(transaction.amount);
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        wallet.balance -= Number(transaction.amount);
      }

      await this.walletRepo.save(wallet);
    }

    transaction.status = status;
    transaction.providerResponse = providerResponse ?? '';

    const savedTransaction = await this.transactionRepo.save(transaction);

    // Save history
    const history = this.historyRepo.create({
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      transaction,
      balanceBefore,
      balanceAfter: wallet.balance,
      transactionId: transaction.id,
    });
    await this.historyRepo.save(history);

    return savedTransaction;
  }

  async findOne(id: string) {
    return this.transactionRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async findByUserId(userId: number) {
    return this.transactionRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepo.find({ relations: ['user'] });
  }

  async remove(id: string) {
    return this.transactionRepo.delete(id);
  }

  async getTransactionHistory(
    transactionId: string,
  ): Promise<TransactionHistories[]> {
    return this.historyRepo.find({
      where: { transactionId },
      relations: ['transaction'],
      order: { createdAt: 'DESC' },
    });
  }
}
