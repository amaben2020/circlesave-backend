import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // CreateDateColumn,
  // UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  firstName: string;

  @Column({ length: 500 })
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  // @CreateDateColumn({ precision: 6 })
  // createdAt: Date;

  // @UpdateDateColumn({ precision: 6 })
  // updatedAt: Date;
}
