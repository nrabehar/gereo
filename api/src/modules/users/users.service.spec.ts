import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PaginationQueryDto } from '@common/dto/pagination.dto.js';
import type { User } from '$prisma/client.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: '01960000-0000-7000-8000-000000000001',
  email: 'jane@example.com',
  name: 'Jane',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides,
});

describe('UsersService', () => {
  let service: UsersService;
  const repository = {
    findById: vi.fn<UsersRepository['findById']>(),
    findPage: vi.fn<UsersRepository['findPage']>(),
    create: vi.fn<UsersRepository['create']>(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: repository },
      ],
    }).compile();
    service = moduleRef.get(UsersService);
  });

  it('returns a user by id', async () => {
    repository.findById.mockResolvedValue(buildUser());
    await expect(service.findOne(buildUser().id)).resolves.toMatchObject({
      email: 'jane@example.com',
    });
  });

  it('throws when the user does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('paginates users', async () => {
    repository.findPage.mockResolvedValue([[buildUser()], 41]);
    const query = Object.assign(new PaginationQueryDto(), {
      page: 2,
      pageSize: 20,
    });
    const result = await service.findPage(query);
    expect(repository.findPage).toHaveBeenCalledWith(20, 20);
    expect(result.meta).toEqual({
      page: 2,
      pageSize: 20,
      total: 41,
      totalPages: 3,
    });
  });
});
