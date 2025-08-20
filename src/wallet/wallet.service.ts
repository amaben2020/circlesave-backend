import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/entities/wallet.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create({ amount, userId }: { amount: number; userId: number }) {
    const user = { id: userId } as User; // reference relation by id

    const newWallet = this.walletRepository.create({
      amount,
      balance: amount,
      user,
    });

    return this.walletRepository.save(newWallet);
  }

  async findOne(id: string) {
    return await this.walletRepository.findOneBy({ id });
  }
  async findByUserId(userId: number) {
    return await this.walletRepository.findOneByOrFail({
      user: { id: userId },
    });
  }
  async updateBalance(walletId: string, amount: number) {
    const wallet = await this.findOne(walletId);

    if (wallet) {
      wallet.balance += amount;
      return await this.walletRepository.save(wallet);
    } else throw new Error(`No wallet found with id ${walletId}`);
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletRepository.find();
  }
  async remove(id: string) {
    return await this.walletRepository.delete(id);
  }
}
