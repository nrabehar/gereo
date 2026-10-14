import { Injectable, NotFoundException } from '@nestjs/common';

import {
  paginate,
  type Paginated,
  PaginationQueryDto,
} from '@common/dto/pagination.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return UserResponseDto.from(user);
  }

  async findPage(
    query: PaginationQueryDto,
  ): Promise<Paginated<UserResponseDto>> {
    const [users, total] = await this.users.findPage(
      query.skip,
      query.pageSize,
    );
    return paginate(
      users.map((user) => UserResponseDto.from(user)),
      total,
      query,
    );
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.users.create({ email: dto.email, name: dto.name });
    return UserResponseDto.from(user);
  }
}
