import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Group } from 'src/entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [TypeOrmModule.forFeature([Group])],
  exports: [GroupsService],
})
export class GroupsModule {}
