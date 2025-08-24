import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Entity } from 'typeorm';

export enum Status {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity()
export class CreateContributionDto {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  cycleNumber: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(Status, { message: 'Status must be pending, success, or failed' })
  status: Status;
}
