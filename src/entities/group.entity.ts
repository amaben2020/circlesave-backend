import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupMember } from './groupMember.entity';

export enum GroupStatus {
  ACTIVE = 'active', // waiting for webhook or confirmation
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum MemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'numeric' })
  cycleAmount: number;

  @Column({ type: 'numeric' })
  cycleNumber: number;

  @Column({ type: 'numeric' })
  currentCycle: number;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
  members: GroupMember[];

  @Column({
    type: 'enum',
    enum: GroupStatus,
  })
  status: GroupStatus;

  @Column({
    type: 'enum',
    enum: MemberRole,
  })
  role: MemberRole;
}
