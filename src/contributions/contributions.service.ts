import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from 'src/entities/contribution.entity';
import { Repository } from 'typeorm';
import { CreateContributionDto } from './dtos/create-contribution';
import { User } from 'src/entities/user.entity';
import { Wallet } from 'src/entities/wallet.entity';
import { GroupMember } from '../entities/groupMember.entity';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionsRepository: Repository<Contribution>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(GroupMember)
    private readonly GroupMemberRepository: Repository<GroupMember>,
  ) {}

  async create(contribution: CreateContributionDto): Promise<Contribution> {
    // check that the user belongs to the group

    const walletBalance = await this.walletRepository.findOne({
      where: { user: { id: contribution.userId } },
    });

    console.log('walletBalance', walletBalance);

    const groupMembership = await this.GroupMemberRepository.findOne({
      where: {
        user: { id: contribution.userId },
        group: { id: contribution.groupId },
      },
    });

    console.log('groupMembership', groupMembership);

    const group = await this.GroupMemberRepository.findOne({
      where: { id: contribution.groupId },
      relations: ['group'],
    });
    if (!groupMembership || !group)
      throw new BadRequestException('User is not in the group');

    if (!walletBalance)
      throw new BadRequestException('User does not have an account');
    if (walletBalance.balance < group.group.cycleAmount)
      throw new BadRequestException('Insufficient funds');

    await this.walletRepository.update(walletBalance.id, {
      balance: walletBalance.balance - contribution.amount,
    });

    const newContribution: Contribution = this.contributionsRepository.create({
      amount: contribution.amount,
      cycleNumber: contribution.cycleNumber,
      group: { id: contribution.groupId },
      user: { id: contribution.userId },
    });

    const successfulContribution =
      await this.contributionsRepository.save(newContribution);

    return successfulContribution;

    // user should only make contribution once to a group cycle
  }
}
