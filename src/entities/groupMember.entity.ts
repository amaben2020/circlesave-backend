import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from './user.entity';

export enum MemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('group_members')
@Unique(['group', 'user']) // ensure a user can’t join the same group twice
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User, (user) => user.groupMemberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  hasReceivedPayout: boolean; // track if this user has gotten payout in current cycle

  @Column({ default: 0 })
  totalContributed: number; // total money contributed by this member

  @Column({ type: 'int', nullable: true })
  payoutOrder: number; // e.g. 1st, 2nd, 3rd in cycle

  @Column({
    type: 'enum',
    enum: MemberRole,
  })
  role: MemberRole;

  @Column({ type: 'timestamp', nullable: true })
  payoutDate: Date; // when they got their payout
}
