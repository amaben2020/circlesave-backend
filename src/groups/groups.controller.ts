import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Controller('groups')
export class GroupsController {
  constructor(
    private groupsService: GroupsService,
    @InjectMetric('get_hello_calls') public counter: Counter<string>,
  ) {}

  @Get()
  getAll() {
    this.counter.inc();
    return 'Ok';
  }

  @Post('/create')
  async create(@Body() createGroup: CreateGroupDto): Promise<any> {
    console.log(createGroup);
    return await this.groupsService.create(createGroup);
  }

  @Post('/join/:groupId/:userId')
  async joinGroup(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    return await this.groupsService.joinGroup(groupId, userId);
  }

  @Patch('/activate/:groupId/:userId')
  async activateGroup(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ) {
    return await this.groupsService.activateGroup(groupId, userId);
  }
}
