import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GroupMember } from './groupMember.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  firstName: string;

  @Column({ length: 500 })
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  phone: string;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user)
  groupMemberships: GroupMember[];

  @CreateDateColumn({ precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ precision: 6 })
  updatedAt: Date;
}
