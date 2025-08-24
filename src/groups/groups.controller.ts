import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  getAll() {
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
}
