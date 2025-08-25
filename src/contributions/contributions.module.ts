import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from 'src/entities/contribution.entity';
import { User } from 'src/entities/user.entity';
import { Wallet } from 'src/entities/wallet.entity';
import { GroupMember } from 'src/entities/groupMember.entity';

@Module({
  controllers: [ContributionsController],
  providers: [ContributionsService],
  imports: [
    TypeOrmModule.forFeature([Contribution, User, Wallet, GroupMember]),
  ],
})
export class ContributionsModule {}
