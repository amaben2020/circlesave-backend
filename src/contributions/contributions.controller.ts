import { Body, Controller, Post } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dtos/create-contribution';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionService: ContributionsService) {}

  @Post()
  async create(@Body() contribution: CreateContributionDto) {
    return this.contributionService.create(contribution);
  }
}
