import { Controller } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  async getGroups(createGroup: CreateGroupDto): Promise<any> {
    return await this.groupsService.create(createGroup);
  }
}
