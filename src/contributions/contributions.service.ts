import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from 'src/entities/contribution.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionsRepository: Repository<Contribution>,
  ) {}

  async create(contribution: Contribution): Promise<Contribution> {
    return this.contributionsRepository.save(contribution);
  }
}
