import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos';

// Narrow MySQL duplicate entry errors safely
type MySqlDuplicateEntryError = {
  code: 'ER_DUP_ENTRY';
  sqlMessage: string;
};

function isMySqlDuplicateEntryError(
  err: unknown,
): err is MySqlDuplicateEntryError {
  if (typeof err !== 'object' || err === null) return false;
  const rec = err as Record<string, unknown>;
  return (
    typeof rec['code'] === 'string' &&
    rec['code'] === 'ER_DUP_ENTRY' &&
    typeof rec['sqlMessage'] === 'string'
  );
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create({ firstName, lastName, email, phone }: CreateUserDto) {
    try {
      const newUser = this.userRepository.create({
        firstName,
        lastName,
        email,
        phone,
      });

      const response = await this.userRepository.save(newUser);

      return response;
    } catch (error: unknown) {
      if (isMySqlDuplicateEntryError(error)) {
        if (error.sqlMessage.includes('phone')) {
          throw new ConflictException('Phone number already exists');
        }
        if (error.sqlMessage.includes('email')) {
          throw new ConflictException('Email already exists');
        }
        throw new ConflictException('Duplicate entry');
      }

      throw new BadRequestException('Could not create user');
    }
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateUser(id: number, data: Partial<User>) {
    return await this.userRepository.update(id, data);
  }
}
