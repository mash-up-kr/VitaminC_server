import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import {
  MockRepository,
  MockRepositoryFactory,
} from 'src/common/helper/mock.helper';

import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

type UserMockRepositoryType = MockRepository<ExtendedEntityRepository<User>>;

describe('UsersService', () => {
  let service: UsersService;
  let mockedRepository: UserMockRepositoryType;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(User);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: repositoryToken,
          useFactory: MockRepositoryFactory.getMockRepository(UsersRepository),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockedRepository = module.get<UserMockRepositoryType>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockedRepository).toBeDefined();
  });
});
