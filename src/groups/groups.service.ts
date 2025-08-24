import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupStatus } from 'src/entities/group.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dtos/create-group';
import { GroupMember, MemberRole } from 'src/entities/groupMember.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>, // ✅ inject repo

    private readonly dataSource: DataSource, // ✅ inject DataSource separately
  ) {}

  async create(newGroup: CreateGroupDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      // --- Create Group
      const group = this.groupRepository.create({
        name: newGroup.name,
        cycleAmount: newGroup.cycleAmount,
        cycleNumber: 0,
        currentCycle: 0,
        status: GroupStatus.ARCHIVED,
      });
      const savedGroup = await queryRunner.manager.save(group);

      // --- Create GroupMember linked to the saved group
      const member = queryRunner.manager.create(GroupMember, {
        group: savedGroup, // relation
        user: { id: newGroup.userId }, // relation
        hasReceivedPayout: false,
        totalContributed: 0,
        payoutOrder: 0,
        role: MemberRole.ADMIN,
      });
      await queryRunner.manager.save(member);

      // --- Commit transaction
      await queryRunner.commitTransaction();

      return savedGroup;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async joinGroup(groupId: number, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const hasJoined = await queryRunner.manager.findOneBy(GroupMember, {
        group: { id: groupId },
        user: { id: userId },
      });

      console.log(hasJoined);

      if (hasJoined?.id) {
        throw new BadRequestException('User has already joined this group');
      }

      const newMember = queryRunner.manager.create(GroupMember, {
        group: { id: groupId }, // relation
        user: { id: userId }, // relation
        hasReceivedPayout: false,
        totalContributed: 0,
        payoutOrder: 0,
        role: MemberRole.MEMBER,
      });
      await queryRunner.manager.save(newMember);
      await queryRunner.commitTransaction(); // 👈 commit only if all good
      return newMember;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
