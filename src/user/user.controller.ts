import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<CreateUserDto> {
    return await this.userService.create(body);
  }

  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }

  @Patch('/update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() body: Partial<CreateUserDto>,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @Get('/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.findOneByEmail(email);
  }
}
