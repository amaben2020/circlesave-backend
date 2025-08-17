import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  // constructor(
  //   @InjectRepository(UserRepository)
  //   private readonly userRepository: UserRepository,
  // ) {}
  async create(user) {
    return user;
  }
}
