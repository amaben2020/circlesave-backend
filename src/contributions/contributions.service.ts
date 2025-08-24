import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from 'src/entities/contribution.entity';
import { Repository } from 'typeorm';
import { CreateContributionDto } from './dtos/create-contribution';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionsRepository: Repository<Contribution>,
  ) {}

  // async create(
  //   contribution: CreateContributionDto,
  // ): Promise<CreateContributionDto> {}
}
