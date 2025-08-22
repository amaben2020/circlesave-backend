import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';
import { Transaction } from './transaction.entity';

export enum ContributionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @OneToMany(() => Transaction, (transaction) => transaction.contribution)
  transactions: Transaction[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @Column({
    type: 'int',
  })
  cycleNumber: number;

  @Column({
    type: 'enum',
    enum: ContributionStatus,
  })
  status: ContributionStatus;
}
