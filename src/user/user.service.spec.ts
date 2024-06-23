import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { ExtendedEntityRepository } from 'src/common/helper/extended-repository.helper';
import {
  MockRepository,
  MockRepositoryFactory,
} from 'src/common/helper/mock.helper';

import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

type UserMockRepositoryType = MockRepository<ExtendedEntityRepository<User>>;

describe('UserService', () => {
  let service: UserService;
  let mockedRepository: UserMockRepositoryType;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(User);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: repositoryToken,
          useFactory: MockRepositoryFactory.getMockRepository(UserRepository),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockedRepository = module.get<UserMockRepositoryType>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockedRepository).toBeDefined();
  });
});
