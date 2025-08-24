import { Module } from '@nestjs/common';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from 'src/entities/contribution.entity';

@Module({
  controllers: [ContributionsController],
  providers: [ContributionsService],
  imports: [TypeOrmModule.forFeature([Contribution])],
})
export class ContributionsModule {}
