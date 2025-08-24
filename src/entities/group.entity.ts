import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupMember } from './groupMember.entity';

export enum GroupStatus {
  ACTIVE = 'active', // active when admin knows the group members are complete
  COMPLETED = 'completed',
  ARCHIVED = 'archived', // default state after creation
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  cycleAmount: number;

  @Column({ type: 'int' })
  cycleNumber: number;

  @Column({ type: 'int' })
  currentCycle: number;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
  members: GroupMember[];

  @Column({
    type: 'enum',
    enum: GroupStatus,
  })
  status: GroupStatus;
}
