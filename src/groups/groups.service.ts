import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupStatus } from 'src/entities/group.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dtos/create-group';
import { GroupMember, MemberRole } from 'src/entities/groupMember.entity';

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
      // If you need per-field logic/transforms → use manual instantiation
      const group = new Group();
      group.name = newGroup.name;
      group.cycleAmount = newGroup.cycleAmount;
      group.cycleNumber = 0; //TODO: DETERMINED BY SYSTEM AFTER GROUP IS ACTIVE
      group.currentCycle = 0;
      group.status = GroupStatus.ARCHIVED;
      const savedGroup = await queryRunner.manager.save(group); // save will execute INSERT query

      // Create GroupMember linked to this group
      const member = new GroupMember();
      member.group = savedGroup; // relation
      // we can grab this from the Guards
      member.user = newGroup.user; // relation
      member.hasReceivedPayout = false;
      member.totalContributed = 0;
      member.payoutOrder = 0; // TODO: determine order of payouts
      member.role = MemberRole.ADMIN;
      member.payoutDate = new Date(); // TODO: set date based on cycle number and current time

      await queryRunner.manager.save(member);

      // Commit if all good
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
