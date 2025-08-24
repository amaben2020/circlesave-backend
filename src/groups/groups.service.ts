import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupStatus } from 'src/entities/group.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateGroupDto } from './dtos/create-group';
import { GroupMember, MemberRole } from 'src/entities/groupMember.entity';

// @Injectable()
// export class GroupsService {
//   constructor(
//     @InjectRepository(Group)
//     // private readonly groupRepository: Repository<Group>,
//     private readonly dataSource: DataSource,
//   ) {}
//   async create(newGroup: CreateGroupDto) {
//     const queryRunner = this.dataSource.createQueryRunner();

//     console.log('newGroup', newGroup);

//     await queryRunner.connect();
//     try {
//       await queryRunner.startTransaction();
//       // If you need per-field logic/transforms → use manual instantiation
//       const group = new Group();
//       group.name = newGroup.name;
//       group.cycleAmount = newGroup.cycleAmount;
//       group.cycleNumber = 0; //TODO: DETERMINED BY SYSTEM AFTER GROUP IS ACTIVE
//       group.currentCycle = 0;
//       group.status = GroupStatus.ARCHIVED;
//       const savedGroup = await queryRunner.manager.save(group); // save will execute INSERT query

//       // Create GroupMember linked to this group
//       const member = new GroupMember();
//       member.group = savedGroup; // relation
//       // we can grab this from the Guards
//       member.user = newGroup.user; // relation
//       member.hasReceivedPayout = false;
//       member.totalContributed = 0;
//       member.payoutOrder = 0; // TODO: determine order of payouts
//       member.role = MemberRole.ADMIN;
//       member.payoutDate = new Date(); // TODO: set date based on cycle number and current time

//       await queryRunner.manager.save(member);

//       // Commit if all good
//       await queryRunner.commitTransaction();
//     } catch (error) {
//       console.log(error);
//       if (error) {
//         // We throw an error here because it's not handled by NestJS
//         // so that we don't accidentally commit changes in case of errors
//         throw error;
//       }
//       await queryRunner.rollbackTransaction();
//     } finally {
//       await queryRunner.release();
//     }
//   }
// }

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
        payoutDate: new Date(),
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
}
