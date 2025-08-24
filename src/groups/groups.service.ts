import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/entities/group.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dtos/create-group';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    private readonly dataSource: DataSource,
  ) {}
  async create(newGroup: CreateGroupDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const group = new Group();
      group.name = newGroup.name;
      group.cycleAmount = newGroup.cycleAmount;
      group.cycleNumber = newGroup.cycleNumber;
      group.currentCycle = newGroup.currentCycle;
      group.status = newGroup.status;
      await queryRunner.manager.save(group); // save will execute INSERT query
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
