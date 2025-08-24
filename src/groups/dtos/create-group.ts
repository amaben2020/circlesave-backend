import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { GroupStatus } from 'src/entities/group.entity';
import { Entity } from 'typeorm';

@Entity()
export class CreateGroupDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsInt() cycleAmount: number;
  @IsNotEmpty() @IsInt() cycleNumber: number;
  @IsNotEmpty() @IsInt() currentCycle: number;
  @IsEnum(GroupStatus) status: GroupStatus;
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
