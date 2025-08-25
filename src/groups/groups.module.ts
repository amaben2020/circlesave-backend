import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Group } from 'src/entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/entities/groupMember.entity';
import {
  PrometheusModule,
  makeCounterProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
  controllers: [GroupsController],
  providers: [
    GroupsService,
    makeCounterProvider({
      name: 'get_hello_calls',
      help: 'Total number of getHello calls',
    }),
  ],
  imports: [
    TypeOrmModule.forFeature([GroupMember, Group]),
    PrometheusModule.register({ path: '/metrics' }),
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
